import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Roles(Role.SUPER_ADMIN, Role.COMPANY_ADMIN)
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Roles(Role.SUPER_ADMIN, Role.COMPANY_ADMIN)
  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Roles(Role.SUPER_ADMIN, Role.COMPANY_ADMIN)
  @Get(':id')
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