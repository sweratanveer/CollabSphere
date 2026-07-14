// This file contains the Workspace entity and database schema for managing multi-tenant company workspaces.
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';

import { Company } from '../../company/entities/company.entity';
import { SubscriptionPlan } from '../enums/subscription-plan.enum';

@Entity('workspaces')
@Index(['company'], { unique: true })
export class Workspace {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  workspaceName!: string;

  @Column({
    unique: true,
  })
  slug!: string;

  @OneToOne(() => Company, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'companyId',
  })
  company!: Company;

  @Column({
    default: 'UTC',
  })
  timezone!: string;

  @Column({
    type: 'enum',
    enum: SubscriptionPlan,
    default: SubscriptionPlan.FREE,
  })
  subscriptionPlan!: SubscriptionPlan;

  @Column({
    default: 5,
  })
  maxUsers!: number;

  @Column({
    default: true,
  })
  isActive!: boolean;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  settings?: Record<string, unknown>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}