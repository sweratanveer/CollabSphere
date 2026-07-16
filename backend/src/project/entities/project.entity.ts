// This file contains the Project entity, linked to a Workspace and an optional Project Manager (User).
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Workspace } from '../../workspace/entities/workspace.entity';
import { User } from '../../users/entities/user.entity';
import { ProjectStatus } from '../enums/project-status.enum';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  projectName!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.PLANNING,
  })
  status!: ProjectStatus;

  @Column({
    type: 'date',
    nullable: true,
  })
  startDate?: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  endDate?: string;

  @Column({
    default: true,
  })
  isActive!: boolean;

  @ManyToOne(() => Workspace, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'workspaceId',
  })
  workspace!: Workspace;

  @ManyToOne(() => User, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'projectManagerId',
  })
  projectManager?: User | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}