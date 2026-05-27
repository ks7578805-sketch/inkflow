import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  list(studioId: string) {
    return this.prisma.project.findMany({
      where: { studioId },
      include: { client: true },
      orderBy: [{ createdAt: 'desc' }],
    });
  }

  async getById(studioId: string, id: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, studioId },
      include: { client: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async create(studioId: string, dto: CreateProjectDto) {
    const client = await this.getClientById(studioId, dto.clientId);

    return this.prisma.project.create({
      data: {
        studioId,
        clientId: client.id,
        name: dto.name.trim(),
        clientName: `${client.firstName} ${client.lastName}`.trim(),
        artistName: this.normalizeOptional(dto.artistName),
        style: this.normalizeOptional(dto.style),
        bodyPart: this.normalizeOptional(dto.bodyPart),
        status: dto.status.trim(),
        valueEstimated: dto.valueEstimated ?? 0,
        valueFinal: dto.valueFinal ?? null,
        deposit: dto.deposit ?? 0,
        totalPaid: dto.totalPaid ?? 0,
        progress: dto.progress ?? 0,
        sessionsDone: dto.sessionsDone ?? 0,
        sessionsTotal: dto.sessionsTotal ?? 0,
        hoursEstimated: dto.hoursEstimated ?? 0,
        hoursReal: dto.hoursReal ?? 0,
        nextSessionAt: dto.nextSessionAt ? new Date(dto.nextSessionAt) : null,
        nextSessionEndAt: dto.nextSessionEndAt ? new Date(dto.nextSessionEndAt) : null,
        nextSessionStatus: this.normalizeOptional(dto.nextSessionStatus),
        notes: this.normalizeOptional(dto.notes),
        thumbnailUrl: this.normalizeOptional(dto.thumbnailUrl),
      },
      include: { client: true },
    });
  }

  async update(studioId: string, id: string, dto: UpdateProjectDto) {
    await this.getById(studioId, id);
    const client = dto.clientId !== undefined ? await this.getClientById(studioId, dto.clientId) : null;

    return this.prisma.project.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.clientId !== undefined ? { client: client ? { connect: { id: client.id } } : { disconnect: true }, clientName: client ? `${client.firstName} ${client.lastName}`.trim() : '' } : {}),
        ...(dto.artistName !== undefined ? { artistName: this.normalizeOptional(dto.artistName) } : {}),
        ...(dto.style !== undefined ? { style: this.normalizeOptional(dto.style) } : {}),
        ...(dto.bodyPart !== undefined ? { bodyPart: this.normalizeOptional(dto.bodyPart) } : {}),
        ...(dto.status !== undefined ? { status: dto.status.trim() } : {}),
        ...(dto.valueEstimated !== undefined ? { valueEstimated: dto.valueEstimated } : {}),
        ...(dto.valueFinal !== undefined ? { valueFinal: dto.valueFinal ?? null } : {}),
        ...(dto.deposit !== undefined ? { deposit: dto.deposit } : {}),
        ...(dto.totalPaid !== undefined ? { totalPaid: dto.totalPaid } : {}),
        ...(dto.progress !== undefined ? { progress: dto.progress } : {}),
        ...(dto.sessionsDone !== undefined ? { sessionsDone: dto.sessionsDone } : {}),
        ...(dto.sessionsTotal !== undefined ? { sessionsTotal: dto.sessionsTotal } : {}),
        ...(dto.hoursEstimated !== undefined ? { hoursEstimated: dto.hoursEstimated } : {}),
        ...(dto.hoursReal !== undefined ? { hoursReal: dto.hoursReal } : {}),
        ...(dto.nextSessionAt !== undefined ? { nextSessionAt: dto.nextSessionAt ? new Date(dto.nextSessionAt) : null } : {}),
        ...(dto.nextSessionEndAt !== undefined ? { nextSessionEndAt: dto.nextSessionEndAt ? new Date(dto.nextSessionEndAt) : null } : {}),
        ...(dto.nextSessionStatus !== undefined ? { nextSessionStatus: this.normalizeOptional(dto.nextSessionStatus) } : {}),
        ...(dto.notes !== undefined ? { notes: this.normalizeOptional(dto.notes) } : {}),
        ...(dto.thumbnailUrl !== undefined ? { thumbnailUrl: this.normalizeOptional(dto.thumbnailUrl) } : {}),
      },
      include: { client: true },
    });
  }

  private normalizeOptional(value?: string | null) {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
  }

  private async getClientById(studioId: string, clientId: string) {
    const client = await this.prisma.client.findFirst({
      where: { id: clientId, studioId },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }
}
