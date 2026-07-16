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
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    unique: true,
  })
  companyName!: string;

  @Column({
    unique: true,
  })
  companyCode!: string;

  @Column({
    unique: true,
  })
  email!: string;

  @Column()
  phone!: string;

  @Column({
    nullable: true,
  })
  website?: string;

  @Column()
  address!: string;

  @Column()
  city!: string;

  @Column()
  country!: string;

  @Column({
    nullable: true,
  })
  logo?: string;

  @Column({
    default: true,
  })
  isActive!: boolean;

  @OneToMany(() => User, (user) => user.company)
  users!: User[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}