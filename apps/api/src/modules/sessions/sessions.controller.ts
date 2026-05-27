import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import type { AuthUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/current-user.decorator';
import { SessionAuthGuard } from '../auth/session-auth.guard';
import { CreateSessionDto } from './dto/create-session.dto';
import { ListSessionsDto } from './dto/list-sessions.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionsService } from './sessions.service';

@Controller('sessions')
@UseGuards(SessionAuthGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  async list(@CurrentUser() user: AuthUser, @Query() query: ListSessionsDto) {
    const items = await this.sessionsService.list(user.studioId, query);
    return { items };
  }

  @Get(':id')
  async getById(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    const session = await this.sessionsService.getById(user.studioId, id);
    return { session };
  }

  @Post()
  async create(@CurrentUser() user: AuthUser, @Body() body: CreateSessionDto) {
    const session = await this.sessionsService.create(user.studioId, body);
    return { session };
  }

  @Patch(':id')
  async update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() body: UpdateSessionDto) {
    const session = await this.sessionsService.update(user.studioId, id, body);
    return { session };
  }

  @Post(':id/conclude')
  async conclude(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    const session = await this.sessionsService.updateStatus(user.studioId, id, 'Concluída');
    return { session };
  }

  @Post(':id/cancel')
  async cancel(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    const session = await this.sessionsService.updateStatus(user.studioId, id, 'Cancelada');
    return { session };
  }
}
