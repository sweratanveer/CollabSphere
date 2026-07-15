// This file defines the Company database entity.
// It stores company information and maintains the relationship
// between a company and its users.

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity('companies')
export class Company {
  // Unique company identifier
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Company name
  @Column()
  companyName!: string;

  // Unique company code
  @Column({
    unique: true,
  })
  companyCode!: string;

  // Company email
  @Column({
    unique: true,
  })
  email!: string;

  // Company contact number
  @Column()
  phone!: string;

  // Company website
  @Column({
    nullable: true,
  })
  website?: string;

  // Company address
  @Column()
  address!: string;

  // Company city
  @Column()
  city!: string;

  // Company country
  @Column()
  country!: string;

  // Company logo URL
  @Column({
    nullable: true,
  })
  logo?: string;

  // Company active status
  @Column({
    default: true,
  })
  isActive!: boolean;

  // Company industry
  @Column({
    nullable: true,
  })
  industry?: string;

  // Company description
  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  // One company can have multiple users
  // Reverse relation of User entity ManyToOne
  @OneToMany(
    () => User,
    (user) => user.company,
  )
  users!: User[];

  // Record creation date
  @CreateDateColumn()
  createdAt!: Date;

  // Record update date
  @UpdateDateColumn()
  updatedAt!: Date;
}