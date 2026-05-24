import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StudiosService {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.studio.findUnique({ where: { id } });
  }
}
