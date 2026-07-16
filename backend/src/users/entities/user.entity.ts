// This file defines the User database entity.
// It stores user information, authentication data, role permissions,
// account status, and relation with Company.

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Role } from '../../common/enums/role.enum';
import { Company } from '../../company/entities/company.entity';

@Entity('users')
export class User {
  // Unique user identifier
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // User full name
  @Column()
  fullName!: string;

  // Unique email used for login
  @Column({
    unique: true,
  })
  email!: string;

  // Encrypted password
  @Column()
  password!: string;

  // User role for RBAC authorization
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.EMPLOYEE,
  })
  role!: Role;

  // Account status
  @Column({
    default: true,
  })
  isActive!: boolean;

  // Company relation
  // One company can have many users
  // One user belongs to one company
  @ManyToOne(
    () => Company,
    (company) => company.users,
    {
      nullable: true,
      onDelete: 'SET NULL',
    },
  )
  @JoinColumn({
    name: 'companyId',
  })
  company?: Company | null;

  // Record creation time
  @CreateDateColumn()
  createdAt!: Date;

  // Record update time
  @UpdateDateColumn()
  updatedAt!: Date;
}