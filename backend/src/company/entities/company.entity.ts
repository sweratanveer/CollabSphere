import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
<<<<<<< HEAD
  OneToMany,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

=======
} from 'typeorm';

>>>>>>> feature/register
@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

<<<<<<< HEAD
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
=======
  @Column()
  companyName!: string;

  @Column()
  companyCode!: string;

  @Column()
>>>>>>> feature/register
  email!: string;

  @Column()
  phone!: string;

<<<<<<< HEAD
  @Column({
    nullable: true,
  })
=======
  @Column({ nullable: true })
>>>>>>> feature/register
  website?: string;

  @Column()
  address!: string;

  @Column()
  city!: string;

  @Column()
  country!: string;

<<<<<<< HEAD
  @Column({
    nullable: true,
  })
  logo?: string;

  @Column({
    default: true,
  })
  isActive!: boolean;

  @Column({
    nullable: true,
  })
  industry?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @OneToMany(() => User, (user) => user.company)
  users!: User[];
=======
  @Column({ nullable: true })
  logo?: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ nullable: true })
  industry?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;
>>>>>>> feature/register

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
<<<<<<< HEAD
}
=======
}
>>>>>>> feature/register
