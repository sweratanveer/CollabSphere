// This file defines the validation rules for creating a new workspace.
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

import { SubscriptionPlan } from '../enums/subscription-plan.enum';

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty()
  workspaceName!: string;

  @IsUUID()
  @IsNotEmpty()
  companyId!: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsEnum(SubscriptionPlan)
  subscriptionPlan?: SubscriptionPlan;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxUsers?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
