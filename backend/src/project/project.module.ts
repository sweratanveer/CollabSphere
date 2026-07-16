// This file wires up the Project module: entity registration, controller, and service.
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { Project } from './entities/project.entity';

import { Workspace } from '../workspace/entities/workspace.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Workspace, User])],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [TypeOrmModule, ProjectService],
})
export class ProjectModule {}