// This file exposes the REST API endpoints for project management, protected by JWT auth and role-based access control.
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Roles(Role.SUPER_ADMIN, Role.COMPANY_ADMIN, Role.PROJECT_MANAGER)
  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Get('workspace/:workspaceId')
  findByWorkspace(@Param('workspaceId') workspaceId: string) {
    return this.projectService.findByWorkspace(workspaceId);
  }

  @Roles(Role.SUPER_ADMIN, Role.COMPANY_ADMIN, Role.PROJECT_MANAGER)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.update(id, updateProjectDto);
  }

  @Roles(Role.SUPER_ADMIN, Role.COMPANY_ADMIN, Role.PROJECT_MANAGER)
  @Patch(':id/status')
  toggleStatus(@Param('id') id: string) {
    return this.projectService.toggleStatus(id);
  }

  @Roles(Role.SUPER_ADMIN, Role.COMPANY_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}