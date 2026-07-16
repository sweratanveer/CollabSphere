// This file wires up the Workspace module: entity registration, controller, and service.
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { Workspace } from './entities/workspace.entity';

import { Company } from '../company/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workspace, Company])],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  exports: [TypeOrmModule, WorkspaceService],
})
export class WorkspaceModule {}