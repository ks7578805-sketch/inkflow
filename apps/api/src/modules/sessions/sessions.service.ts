import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { ListSessionsDto } from './dto/list-sessions.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  list(studioId: string, query: ListSessionsDto) {
    return this.prisma.session.findMany({
      where: {
        studioId,
        ...(query.projectId ? { projectId: query.projectId } : {}),
        ...(query.from || query.to
          ? {
              startsAt: {
                ...(query.from ? { gte: new Date(query.from) } : {}),
                ...(query.to ? { lte: new Date(query.to) } : {}),
              },
            }
          : {}),
      },
      include: {
        project: {
          include: {
            client: true,
          },
        },
      },
      orderBy: [{ startsAt: 'asc' }],
    });
  }

  async getById(studioId: string, id: string) {
    const session = await this.prisma.session.findFirst({
      where: { id, studioId },
      include: {
        project: {
          include: {
            client: true,
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  async create(studioId: string, dto: CreateSessionDto) {
    this.ensureValidRange(dto.startsAt, dto.endsAt);
    const project = await this.getProjectById(studioId, dto.projectId);

    const result = await this.prisma.$transaction(async (tx) => {
      const session = await tx.session.create({
        data: {
          studioId,
          projectId: project.id,
          startsAt: new Date(dto.startsAt),
          endsAt: new Date(dto.endsAt),
          status: dto.status.trim(),
          notes: this.normalizeOptional(dto.notes),
        },
        include: {
          project: {
            include: {
              client: true,
            },
          },
        },
      });

      await this.refreshProjectSummary(tx, studioId, project.id);
      return session;
    });

    return this.getById(studioId, result.id);
  }

  async update(studioId: string, id: string, dto: UpdateSessionDto) {
    const current = await this.getById(studioId, id);

    this.ensureValidRange(dto.startsAt ?? current.startsAt.toISOString(), dto.endsAt ?? current.endsAt.toISOString());

    const result = await this.prisma.$transaction(async (tx) => {
      const session = await tx.session.update({
        where: { id },
        data: {
          ...(dto.startsAt !== undefined ? { startsAt: new Date(dto.startsAt) } : {}),
          ...(dto.endsAt !== undefined ? { endsAt: new Date(dto.endsAt) } : {}),
          ...(dto.status !== undefined ? { status: dto.status.trim() } : {}),
          ...(dto.notes !== undefined ? { notes: this.normalizeOptional(dto.notes) } : {}),
        },
        include: {
          project: {
            include: {
              client: true,
            },
          },
        },
      });

      await this.refreshProjectSummary(tx, studioId, current.projectId);
      return session;
    });

    return this.getById(studioId, result.id);
  }

  async updateStatus(studioId: string, id: string, status: string) {
    const current = await this.getById(studioId, id);

    const result = await this.prisma.$transaction(async (tx) => {
      const session = await tx.session.update({
        where: { id },
        data: { status },
      });

      await this.refreshProjectSummary(tx, studioId, current.projectId);
      return session;
    });

    return this.getById(studioId, result.id);
  }

  private async getProjectById(studioId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, studioId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  private ensureValidRange(startsAt: string, endsAt: string) {
    if (new Date(endsAt) <= new Date(startsAt)) {
      throw new BadRequestException('Session end must be after start');
    }
  }

  private normalizeOptional(value?: string | null) {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
  }

  private async refreshProjectSummary(tx: Prisma.TransactionClient, studioId: string, projectId: string) {
    const sessions = await tx.session.findMany({
      where: { studioId, projectId },
      orderBy: [{ startsAt: 'asc' }],
    });

    const now = new Date();
    const upcoming = sessions.find((session) => session.status !== 'Cancelada' && session.startsAt >= now) ?? null;
    const completedSessions = sessions.filter((session) => session.status === 'Concluída');
    const hoursReal = completedSessions.reduce((total, session) => total + (session.endsAt.getTime() - session.startsAt.getTime()) / (60 * 60 * 1000), 0);

    await tx.project.update({
      where: { id: projectId },
      data: {
        sessionsTotal: sessions.length,
        sessionsDone: completedSessions.length,
        hoursReal: Math.round(hoursReal * 100) / 100,
        nextSessionAt: upcoming?.startsAt ?? null,
        nextSessionEndAt: upcoming?.endsAt ?? null,
        nextSessionStatus: upcoming?.status ?? null,
      },
    });
  }
}
