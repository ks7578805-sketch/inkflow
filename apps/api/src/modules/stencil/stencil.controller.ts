import { Body, Controller, Get, Param, ParseFilePipeBuilder, Post, Query, Req, Res, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import { CurrentUser } from '../auth/current-user.decorator';
import { SessionAuthGuard } from '../auth/session-auth.guard';
import type { AuthUser } from '../auth/auth.types';
import { CreateStencilGenerationDto } from './dto/create-stencil-generation.dto';
import { SaveStencilVersionDto } from './dto/save-stencil-version.dto';
import { StencilService } from './stencil.service';

@Controller('stencil')
@UseGuards(SessionAuthGuard)
export class StencilController {
  constructor(private readonly stencilService: StencilService) {}

  @Post('assets/upload')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: (Number(process.env.STENCIL_UPLOAD_MAX_MB || '10') || 10) * 1024 * 1024 } }))
  async uploadAsset(
    @CurrentUser() user: AuthUser,
    @UploadedFile(new ParseFilePipeBuilder()
      .addFileTypeValidator({ fileType: /(jpeg|jpg|png|webp)$/i })
      .build({ fileIsRequired: true }))
    file: Express.Multer.File,
  ) {
    return this.stencilService.saveAsset(user, file);
  }

  @Post('generations')
  async createGeneration(@CurrentUser() user: AuthUser, @Body() body: CreateStencilGenerationDto) {
    return this.stencilService.createGeneration(user, body);
  }

  @Get('generations/:id')
  async getGeneration(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.stencilService.getGeneration(user, id);
  }

  @Post('versions/:id/save')
  async saveVersion(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() body: SaveStencilVersionDto) {
    return this.stencilService.saveVersion(user, id, body);
  }

  @Get('versions/:id/export')
  async exportVersion(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Query('format') format: 'png' | 'pdf',
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const result = await this.stencilService.exportVersion(user, id, format === 'pdf' ? 'pdf' : 'png');
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`);
    return result.file;
  }

  @Get('files/*')
  async getFile(
    @CurrentUser() user: AuthUser,
    @Req() req: Request & { params: Record<string, string> },
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const relativePath = req.params[0];
    const result = await this.stencilService.getFileBuffer(user, relativePath);
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Cache-Control', 'private, max-age=60');
    return new StreamableFile(result.buffer);
  }
}
