<<<<<<< HEAD
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
=======
import { Injectable } from '@nestjs/common';
>>>>>>> feature/register
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from './entities/company.entity';
<<<<<<< HEAD
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
=======
>>>>>>> feature/register

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

<<<<<<< HEAD
async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
  const exists = await this.companyRepository.findOne({
    where: [
      { companyName: createCompanyDto.companyName },
      { companyCode: createCompanyDto.companyCode },
      { email: createCompanyDto.email },
    ],
  });

  if (exists) {
    throw new BadRequestException(
      'Company already exists.',
    );
  }

  const company = this.companyRepository.create(createCompanyDto);

  return await this.companyRepository.save(company);
}

  async findAll(): Promise<Company[]> {
    return await this.companyRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

async update(
  id: string,
  updateCompanyDto: UpdateCompanyDto,
): Promise<Company> {

  const company = await this.findOne(id);

  Object.assign(company, updateCompanyDto);

  return await this.companyRepository.save(company);
}

  async remove(id: string): Promise<void> {
    const company = await this.findOne(id);

    await this.companyRepository.remove(company);
  }
}
=======
  findAll(): Promise<Company[]> {
    return this.companyRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: string): Promise<Company | null> {
    return this.companyRepository.findOne({
      where: { id },
    });
  }

  create(companyData: Partial<Company>): Promise<Company> {
    const company = this.companyRepository.create(companyData);
    return this.companyRepository.save(company);
  }

  async update(
    id: string,
    companyData: Partial<Company>,
  ): Promise<Company | null> {
    await this.companyRepository.update(id, companyData);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.companyRepository.delete(id);
  }
}
>>>>>>> feature/register
