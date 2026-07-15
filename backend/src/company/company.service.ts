import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';


@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

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