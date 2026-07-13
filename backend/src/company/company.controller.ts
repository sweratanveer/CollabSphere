<<<<<<< HEAD
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../common/enums/role.enum';
=======
>>>>>>> feature/register
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CompanyService } from './company.service';
<<<<<<< HEAD
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@UseGuards(JwtAuthGuard, RolesGuard)

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

@Roles(Role.SUPER_ADMIN)
@Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  findAll() {
=======
import { Company } from './entities/company.entity';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  findAll(): Promise<Company[]> {
>>>>>>> feature/register
    return this.companyService.findAll();
  }

  @Get(':id')
<<<<<<< HEAD
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Roles(Role.SUPER_ADMIN, Role.COMPANY_ADMIN)
@Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companyService.update(id, updateCompanyDto);
  }

 @Roles(Role.SUPER_ADMIN)
@Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }
}
=======
  findOne(@Param('id') id: string): Promise<Company | null> {
    return this.companyService.findOne(id);
  }

  @Post()
  create(@Body() body: Partial<Company>): Promise<Company> {
    return this.companyService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: Partial<Company>,
  ): Promise<Company | null> {
    return this.companyService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.companyService.remove(id);
  }
}
>>>>>>> feature/register
