import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import type { AuthUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/current-user.decorator';
import { SessionAuthGuard } from '../auth/session-auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseGuards(SessionAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async list(@CurrentUser() user: AuthUser) {
    const items = await this.projectsService.list(user.studioId);
    return { items };
  }

  @Get(':id')
  async getById(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    const project = await this.projectsService.getById(user.studioId, id);
    return { project };
  }

  @Post()
  async create(@CurrentUser() user: AuthUser, @Body() body: CreateProjectDto) {
    const project = await this.projectsService.create(user.studioId, body);
    return { project };
  }

  @Patch(':id')
  async update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() body: UpdateProjectDto) {
    const project = await this.projectsService.update(user.studioId, id, body);
    return { project };
  }
}
