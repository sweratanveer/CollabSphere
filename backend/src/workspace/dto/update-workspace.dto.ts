// This file defines the validation rules for updating an existing workspace. companyId cannot be changed here.
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { SubscriptionPlan } from '../enums/subscription-plan.enum';

export class UpdateWorkspaceDto {
  @IsOptional()
  @IsString()
  workspaceName?: string;

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