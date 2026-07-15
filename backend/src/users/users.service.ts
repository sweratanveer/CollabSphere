import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { Company } from '../company/entities/company.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: {
        company: true,
      },
    });
  }


  async findCompanyById(id: string): Promise<Company | null> {
    return this.companyRepository.findOne({
      where: { id },
    });
  }

  async findOne(id: string): Promise<User |null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async updateProfile(
    id: string,
    data: Partial<User>,
  ): Promise<User | null> {
    await this.userRepository.update(id, data);

    return this.findOne(id);
  }
}