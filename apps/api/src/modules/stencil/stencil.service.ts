import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import type { AuthUser } from '../auth/auth.types';
import type {
  CreateStencilGenerationRequest,
  SaveStencilVersionRequest,
  StencilAssetDto,
  StencilGenerationDto,
  StencilPrecheckAnalysis,
  StencilProvider,
  StencilVersionDto,
  StencilVersionMetadata,
} from '@inkflow/contracts';
import type { Prisma, StencilGeneration, StencilVariantKind } from '@prisma/client';
import PDFDocument = require('pdfkit');
import sharp = require('sharp');
import { PrismaService } from '../../prisma/prisma.service';
import { StencilAiService } from './stencil-ai.service';
import { StencilStorage } from './stencil.storage';

@Injectable()
export class StencilService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stencilAiService: StencilAiService,
    private readonly stencilStorage: StencilStorage,
  ) {}

  async saveAsset(user: AuthUser, file: Express.Multer.File) {
    const metadata = await sharp(file.buffer).metadata();
    const extension = this.extensionForMime(file.mimetype);
    const stored = await this.stencilStorage.saveBuffer(
      `${user.studioId}/assets/${Date.now()}-${this.slugify(file.originalname || 'reference')}.${extension}`,
      file.buffer,
      { contentType: file.mimetype },
    );

    const asset = await this.prisma.stencilAsset.create({
      data: {
        studioId: user.studioId,
        createdByUserId: user.id,
        originalName: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        width: metadata.width ?? null,
        height: metadata.height ?? null,
        storagePath: stored.relativePath,
        publicUrl: stored.publicUrl,
      },
    });

    return { asset: this.mapAsset(asset) };
  }

  async createGeneration(user: AuthUser, payload: CreateStencilGenerationRequest) {
    const asset = await this.prisma.stencilAsset.findFirst({
      where: { id: payload.assetId, studioId: user.studioId },
    });

    if (!asset) {
      throw new NotFoundException('Stencil asset not found');
    }

    if (payload.projectId) {
      const project = await this.prisma.project.findFirst({ where: { id: payload.projectId, studioId: user.studioId } });
      if (!project) {
        throw new NotFoundException('Project not found');
      }
    }

    const generation = await this.prisma.stencilGeneration.create({
      data: {
        studioId: user.studioId,
        createdByUserId: user.id,
        assetId: asset.id,
        projectId: payload.projectId ?? null,
        selectedStyle: payload.selectedStyle,
        lineThickness: payload.lineThickness,
        simplify: payload.simplify,
        layerCount: payload.layerCount,
        lineColor: payload.lineColor,
        outputSize: payload.outputSize,
        provider: payload.provider ?? 'google',
        status: 'PENDING',
      },
    });

    try {
      const assetBuffer = await this.stencilStorage.readBuffer(asset.storagePath);
      const analysis = await this.stencilAiService.analyzeReferenceImage(assetBuffer, asset.mimeType, payload.provider ?? 'google');
      const variants = await this.stencilAiService.generateVariants(assetBuffer, asset.mimeType, payload, analysis);

      const createdVersions = [] as Prisma.StencilVersionUncheckedCreateInput[];

      for (const variant of variants) {
        const stored = await this.stencilStorage.saveBuffer(
          `${user.studioId}/generations/${generation.id}/${variant.kind}.png`,
          variant.bytes,
          { contentType: variant.mimeType },
        );
        createdVersions.push({
          generationId: generation.id,
          kind: variant.kind,
          label: variant.label,
          mimeType: variant.mimeType,
          width: variant.width,
          height: variant.height,
          storagePath: stored.relativePath,
          publicUrl: stored.publicUrl,
          metadataJson: variant.metadata as Prisma.InputJsonValue,
        });
      }

      await this.prisma.$transaction(async (tx) => {
        await tx.stencilVersion.createMany({ data: createdVersions });
        await tx.stencilGeneration.update({
          where: { id: generation.id },
          data: {
            analysisJson: analysis as unknown as Prisma.InputJsonValue,
            status: 'COMPLETED',
          },
        });
      });
    } catch (error) {
      await this.prisma.stencilGeneration.update({
        where: { id: generation.id },
        data: {
          status: 'FAILED',
          analysisJson: { error: error instanceof Error ? error.message : 'Generation failed' },
        },
      });
      throw error;
    }

    return { generation: await this.getGenerationById(user, generation.id) };
  }

  async getGeneration(user: AuthUser, id: string) {
    return { generation: await this.getGenerationById(user, id) };
  }

  async saveVersion(user: AuthUser, id: string, payload: SaveStencilVersionRequest) {
    const version = await this.prisma.stencilVersion.findFirst({
      where: {
        id,
        generation: {
          studioId: user.studioId,
        },
      },
      include: {
        generation: true,
      },
    });

    if (!version) {
      throw new NotFoundException('Stencil version not found');
    }

    if (payload.projectId) {
      const project = await this.prisma.project.findFirst({ where: { id: payload.projectId, studioId: user.studioId } });
      if (!project) {
        throw new NotFoundException('Project not found');
      }
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.stencilVersion.update({
        where: { id },
        data: { savedAt: new Date() },
      });
      await tx.stencilGeneration.update({
        where: { id: version.generationId },
        data: {
          savedVersionId: id,
          ...(payload.projectId !== undefined ? { projectId: payload.projectId ?? null } : {}),
        },
      });
    });

    return { generation: await this.getGenerationById(user, version.generationId) };
  }

  async exportVersion(user: AuthUser, id: string, format: 'png' | 'pdf') {
    const version = await this.prisma.stencilVersion.findFirst({
      where: {
        id,
        generation: {
          studioId: user.studioId,
        },
      },
      include: {
        generation: {
          include: {
            asset: true,
          },
        },
      },
    });

    if (!version) {
      throw new NotFoundException('Stencil version not found');
    }

    const buffer = await this.stencilStorage.readBuffer(version.storagePath);

    if (format === 'png') {
      return {
        file: new StreamableFile(buffer),
        contentType: 'image/png',
        fileName: `${version.label.toLowerCase().replace(/\s+/g, '-')}.png`,
      };
    }

    const pdfBuffer = await this.renderPdf(buffer, version.width ?? 2480, version.height ?? 3508);
    return {
      file: new StreamableFile(pdfBuffer),
      contentType: 'application/pdf',
      fileName: `${version.label.toLowerCase().replace(/\s+/g, '-')}.pdf`,
    };
  }

  private async renderPdf(pngBuffer: Buffer, width: number, height: number) {
    const doc = new PDFDocument({ size: 'A4', margin: 24 });
    const chunks: Buffer[] = [];

    return await new Promise<Buffer>((resolve, reject) => {
      doc.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const pageHeight = doc.page.height - doc.page.margins.top - doc.page.margins.bottom;
      const fitRatio = Math.min(pageWidth / width, pageHeight / height);
      const drawWidth = width * fitRatio;
      const drawHeight = height * fitRatio;
      const x = doc.page.margins.left + (pageWidth - drawWidth) / 2;
      const y = doc.page.margins.top + (pageHeight - drawHeight) / 2;

      doc.image(pngBuffer, x, y, { width: drawWidth, height: drawHeight });
      doc.end();
    });
  }

  async getFileBuffer(user: AuthUser, relativePath: string) {
    const asset = await this.prisma.stencilAsset.findFirst({
      where: {
        studioId: user.studioId,
        storagePath: relativePath,
      },
      select: {
        mimeType: true,
        originalName: true,
      },
    });

    if (asset) {
      return {
        buffer: await this.stencilStorage.readBuffer(relativePath),
        contentType: asset.mimeType,
        fileName: asset.originalName,
      };
    }

    const version = await this.prisma.stencilVersion.findFirst({
      where: {
        storagePath: relativePath,
        generation: {
          studioId: user.studioId,
        },
      },
      select: {
        mimeType: true,
        label: true,
      },
    });

    if (!version) {
      throw new NotFoundException('Stencil file not found');
    }

    return {
      buffer: await this.stencilStorage.readBuffer(relativePath),
      contentType: version.mimeType,
      fileName: `${version.label.toLowerCase().replace(/\s+/g, '-')}.png`,
    };
  }

  private async getGenerationById(user: AuthUser, id: string): Promise<StencilGenerationDto> {
    const generation = await this.prisma.stencilGeneration.findFirst({
      where: { id, studioId: user.studioId },
      include: {
        asset: true,
        versions: {
          orderBy: [{ createdAt: 'asc' }],
        },
      },
    });

    if (!generation) {
      throw new NotFoundException('Stencil generation not found');
    }

    return this.mapGeneration(generation);
  }

  private mapGeneration(
    generation: StencilGeneration & {
      asset: Prisma.StencilAssetGetPayload<Record<string, never>>;
      versions: Prisma.StencilVersionGetPayload<Record<string, never>>[];
    },
  ): StencilGenerationDto {
    return {
      id: generation.id,
      assetId: generation.assetId,
      projectId: generation.projectId,
      status: generation.status,
      selectedStyle: generation.selectedStyle as CreateStencilGenerationRequest['selectedStyle'],
      lineThickness: generation.lineThickness,
      simplify: generation.simplify,
      layerCount: generation.layerCount,
      lineColor: generation.lineColor,
      outputSize: generation.outputSize as CreateStencilGenerationRequest['outputSize'],
      provider: ((generation as unknown as { provider?: StencilProvider }).provider ?? 'google') as StencilProvider,
      analysis: (generation.analysisJson as unknown as StencilPrecheckAnalysis | null) ?? null,
      savedVersionId: generation.savedVersionId,
      createdAt: generation.createdAt.toISOString(),
      updatedAt: generation.updatedAt.toISOString(),
      asset: this.mapAsset(generation.asset),
      versions: generation.versions.map((version) => this.mapVersion(version)),
    };
  }

  private mapAsset(asset: Prisma.StencilAssetGetPayload<Record<string, never>>): StencilAssetDto {
    return {
      id: asset.id,
      originalName: asset.originalName,
      mimeType: asset.mimeType,
      sizeBytes: asset.sizeBytes,
      width: asset.width,
      height: asset.height,
      publicUrl: asset.publicUrl,
      createdAt: asset.createdAt.toISOString(),
    };
  }

  private mapVersion(version: Prisma.StencilVersionGetPayload<Record<string, never>>): StencilVersionDto {
    return {
      id: version.id,
      generationId: version.generationId,
      kind: version.kind as StencilVariantKind,
      label: version.label,
      mimeType: version.mimeType,
      width: version.width,
      height: version.height,
      publicUrl: version.publicUrl,
      metadata: (version.metadataJson as unknown as StencilVersionMetadata) ?? {
        preset: 'fineline',
        variant: version.kind as StencilVariantKind,
        outputSize: 'a4',
        lineThickness: 50,
        simplify: 30,
        layerCount: 2,
        lineColor: '#080808',
        sourceWidth: null,
        sourceHeight: null,
        generatedAt: version.createdAt.toISOString(),
        provider: 'google',
        model: 'gemini-2.5-flash-image',
        providerMode: 'real_api',
      },
      savedAt: version.savedAt ? version.savedAt.toISOString() : null,
      createdAt: version.createdAt.toISOString(),
    };
  }

  private extensionForMime(mimeType: string) {
    if (mimeType === 'image/png') return 'png';
    if (mimeType === 'image/webp') return 'webp';
    return 'jpg';
  }

  private slugify(value: string) {
    return value
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-zA-Z0-9.-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase() || 'reference';
  }
}
