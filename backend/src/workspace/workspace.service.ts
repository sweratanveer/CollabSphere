// This file contains the business logic for creating, reading, updating, and deleting workspaces.

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Workspace } from './entities/workspace.entity';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

import { Company } from '../company/entities/company.entity';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  async create(createWorkspaceDto: CreateWorkspaceDto): Promise<Workspace> {
    const company = await this.companyRepository.findOne({
      where: { id: createWorkspaceDto.companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const existingForCompany = await this.workspaceRepository.findOne({
      where: { company: { id: company.id } },
    });

    if (existingForCompany) {
      throw new BadRequestException(
        'A workspace already exists for this company',
      );
    }

    const slug =
      createWorkspaceDto.slug?.trim() ||
      this.generateSlug(createWorkspaceDto.workspaceName);

    const slugTaken = await this.workspaceRepository.findOne({
      where: { slug },
    });

    if (slugTaken) {
      throw new BadRequestException('Workspace slug is already in use');
    }

    const workspace = this.workspaceRepository.create({
      workspaceName: createWorkspaceDto.workspaceName,
      slug,
      company,
      timezone: createWorkspaceDto.timezone,
      subscriptionPlan: createWorkspaceDto.subscriptionPlan,
      maxUsers: createWorkspaceDto.maxUsers,
      isActive: createWorkspaceDto.isActive,
    });

    return await this.workspaceRepository.save(workspace);
  }

  async findAll(): Promise<Workspace[]> {
    return await this.workspaceRepository.find({
      relations: { company: true },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id },
      relations: { company: true },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    return workspace;
  }

  async findByCompany(companyId: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne({
      where: { company: { id: companyId } },
      relations: { company: true },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found for this company');
    }

    return workspace;
  }

  async update(
    id: string,
    updateWorkspaceDto: UpdateWorkspaceDto,
  ): Promise<Workspace> {
    const workspace = await this.findOne(id);

    if (
      updateWorkspaceDto.slug &&
      updateWorkspaceDto.slug !== workspace.slug
    ) {
      const slugTaken = await this.workspaceRepository.findOne({
        where: { slug: updateWorkspaceDto.slug },
      });

      if (slugTaken) {
        throw new BadRequestException('Workspace slug is already in use');
      }
    }

    Object.assign(workspace, updateWorkspaceDto);

    return await this.workspaceRepository.save(workspace);
  }

  async toggleStatus(id: string): Promise<Workspace> {
    const workspace = await this.findOne(id);

    workspace.isActive = !workspace.isActive;

    return await this.workspaceRepository.save(workspace);
  }

  async remove(id: string): Promise<void> {
    const workspace = await this.findOne(id);

    await this.workspaceRepository.remove(workspace);
  }
}