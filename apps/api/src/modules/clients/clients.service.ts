import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(studioId: string, search?: string) {
    const normalizedSearch = search?.trim();

    return this.prisma.client.findMany({
      where: {
        studioId,
        ...(normalizedSearch
          ? {
              OR: [
                { firstName: { contains: normalizedSearch, mode: 'insensitive' } },
                { lastName: { contains: normalizedSearch, mode: 'insensitive' } },
                { email: { contains: normalizedSearch, mode: 'insensitive' } },
                { phone: { contains: normalizedSearch } },
              ],
            }
          : {}),
      },
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
    });
  }

  async getById(studioId: string, id: string) {
    const client = await this.prisma.client.findFirst({
      where: { id, studioId },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  create(studioId: string, dto: CreateClientDto) {
    return this.prisma.client.create({
      data: {
        studioId,
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
        phone: this.normalizeOptional(dto.phone),
        email: this.normalizeEmail(dto.email),
        instagram: this.normalizeInstagram(dto.instagram),
        notes: this.normalizeOptional(dto.notes),
      },
    });
  }

  async update(studioId: string, id: string, dto: UpdateClientDto) {
    await this.getById(studioId, id);

    return this.prisma.client.update({
      where: { id },
      data: {
        ...(dto.firstName !== undefined ? { firstName: dto.firstName.trim() } : {}),
        ...(dto.lastName !== undefined ? { lastName: dto.lastName.trim() } : {}),
        ...(dto.phone !== undefined ? { phone: this.normalizeOptional(dto.phone) } : {}),
        ...(dto.email !== undefined ? { email: this.normalizeEmail(dto.email) } : {}),
        ...(dto.instagram !== undefined ? { instagram: this.normalizeInstagram(dto.instagram) } : {}),
        ...(dto.notes !== undefined ? { notes: this.normalizeOptional(dto.notes) } : {}),
        ...(dto.pipelineStatus !== undefined ? { pipelineStatus: dto.pipelineStatus } : {}),
      },
    });
  }

  async remove(studioId: string, id: string) {
    const client = await this.getById(studioId, id);

    await this.prisma.client.delete({
      where: { id },
    });

    return client;
  }

  private normalizeOptional(value?: string) {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
  }

  private normalizeEmail(value?: string) {
    const trimmed = value?.trim();
    return trimmed ? trimmed.toLowerCase() : null;
  }

  private normalizeInstagram(value?: string) {
    const trimmed = value?.trim();
    if (!trimmed) {
      return null;
    }

    return trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
  }
}
