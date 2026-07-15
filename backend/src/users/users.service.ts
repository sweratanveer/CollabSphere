// This file contains the business logic for user profile management and admin-level user CRUD operations.
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { Company } from '../company/entities/company.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  // --- Existing methods used by Auth module — unchanged ---

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findOne(id: string): Promise<User | null> {
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

  // --- New methods for the User Management module (admin CRUD) ---

  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find({
      relations: { company: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { company: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existing) {
      throw new BadRequestException('Email is already in use');
    }

    let company: Company | null = null;

    if (createUserDto.companyId) {
      company = await this.companyRepository.findOne({
        where: { id: createUserDto.companyId },
      });

      if (!company) {
        throw new NotFoundException('Company not found');
      }
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      fullName: createUserDto.fullName,
      email: createUserDto.email,
      password: hashedPassword,
      role: createUserDto.role,
      isActive: createUserDto.isActive,
      company,
    });

    return await this.userRepository.save(user);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findUserById(id);

    if (updateUserDto.companyId !== undefined) {
      const company = await this.companyRepository.findOne({
        where: { id: updateUserDto.companyId },
      });

      if (!company) {
        throw new NotFoundException('Company not found');
      }

      user.company = company;
    }

    if (updateUserDto.fullName !== undefined) {
      user.fullName = updateUserDto.fullName;
    }

    if (updateUserDto.role !== undefined) {
      user.role = updateUserDto.role;
    }

    if (updateUserDto.isActive !== undefined) {
      user.isActive = updateUserDto.isActive;
    }

    return await this.userRepository.save(user);
  }

  async toggleUserStatus(id: string): Promise<User> {
    const user = await this.findUserById(id);

    user.isActive = !user.isActive;

    return await this.userRepository.save(user);
  }

  async removeUser(id: string): Promise<void> {
    const user = await this.findUserById(id);

    await this.userRepository.remove(user);
  }
}