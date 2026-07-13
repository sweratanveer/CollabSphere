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

>>>>>>> 24eb98fff81c1fc1bc66249041e50f5bd14e077b
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
>>>>>>> 24eb98fff81c1fc1bc66249041e50f5bd14e077b
  email!: string;

  @Column()
  phone!: string;

<<<<<<< HEAD
  @Column({
    nullable: true,
  })
=======
  @Column({ nullable: true })
>>>>>>> 24eb98fff81c1fc1bc66249041e50f5bd14e077b
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
>>>>>>> 24eb98fff81c1fc1bc66249041e50f5bd14e077b

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
<<<<<<< HEAD
}
=======
}
>>>>>>> 24eb98fff81c1fc1bc66249041e50f5bd14e077b
