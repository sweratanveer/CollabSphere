import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

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
