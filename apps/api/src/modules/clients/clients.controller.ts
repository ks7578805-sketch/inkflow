import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import type { AuthUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/current-user.decorator';
import { SessionAuthGuard } from '../auth/session-auth.guard';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { ListClientsQueryDto } from './dto/list-clients-query.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
@UseGuards(SessionAuthGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  async list(@CurrentUser() user: AuthUser, @Query() query: ListClientsQueryDto) {
    const items = await this.clientsService.list(user.studioId, query.search);
    return { items };
  }

  @Get(':id')
  async getById(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    const client = await this.clientsService.getById(user.studioId, id);
    return { client };
  }

  @Post()
  async create(@CurrentUser() user: AuthUser, @Body() body: CreateClientDto) {
    const client = await this.clientsService.create(user.studioId, body);
    return { client };
  }

  @Patch(':id')
  async update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() body: UpdateClientDto) {
    const client = await this.clientsService.update(user.studioId, id, body);
    return { client };
  }

  @Delete(':id')
  async remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    const client = await this.clientsService.remove(user.studioId, id);
    return { client };
  }
}
