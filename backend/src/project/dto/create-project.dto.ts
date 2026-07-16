// This file defines the validation rules for creating a new project.
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { ProjectStatus } from '../enums/project-status.enum';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  projectName!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  @IsNotEmpty()
  workspaceId!: string;

  @IsOptional()
  @IsUUID()
  projectManagerId?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}