// This file contains the business logic for creating, reading, updating, and deleting projects.
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

import { Workspace } from '../workspace/entities/workspace.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: createProjectDto.workspaceId },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    let projectManager: User | null = null;

    if (createProjectDto.projectManagerId) {
      projectManager = await this.userRepository.findOne({
        where: { id: createProjectDto.projectManagerId },
      });

      if (!projectManager) {
        throw new NotFoundException('Project manager not found');
      }
    }

    const project = this.projectRepository.create({
      projectName: createProjectDto.projectName,
      description: createProjectDto.description,
      workspace,
      projectManager,
      status: createProjectDto.status,
      startDate: createProjectDto.startDate,
      endDate: createProjectDto.endDate,
    });

    return await this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find({
      relations: { workspace: true, projectManager: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: { workspace: true, projectManager: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async findByWorkspace(workspaceId: string): Promise<Project[]> {
    return await this.projectRepository.find({
      where: { workspace: { id: workspaceId } },
      relations: { workspace: true, projectManager: true },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);

    if (updateProjectDto.projectManagerId !== undefined) {
      const projectManager = await this.userRepository.findOne({
        where: { id: updateProjectDto.projectManagerId },
      });

      if (!projectManager) {
        throw new NotFoundException('Project manager not found');
      }

      project.projectManager = projectManager;
    }

    if (updateProjectDto.projectName !== undefined) {
      project.projectName = updateProjectDto.projectName;
    }

    if (updateProjectDto.description !== undefined) {
      project.description = updateProjectDto.description;
    }

    if (updateProjectDto.status !== undefined) {
      project.status = updateProjectDto.status;
    }

    if (updateProjectDto.startDate !== undefined) {
      project.startDate = updateProjectDto.startDate;
    }

    if (updateProjectDto.endDate !== undefined) {
      project.endDate = updateProjectDto.endDate;
    }

    if (updateProjectDto.isActive !== undefined) {
      project.isActive = updateProjectDto.isActive;
    }

    return await this.projectRepository.save(project);
  }

  async toggleStatus(id: string): Promise<Project> {
    const project = await this.findOne(id);

    project.isActive = !project.isActive;

    return await this.projectRepository.save(project);
  }

  async remove(id: string): Promise<void> {
    const project = await this.findOne(id);

    await this.projectRepository.remove(project);
  }
}