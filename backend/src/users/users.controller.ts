import {
  Controller,
  Get,
  Patch,
  Body,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';

import { UsersService } from './users.service';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return {
      message: 'Profile fetched successfully',
      user: req.user,
    };
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Req() req,
    @Body() body,
  ) {
    const user = await this.usersService.updateProfile(
      req.user.id,
      body,
    );

    return {
      message: 'Profile updated successfully',
      user,
    };
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  getAdminData(@Req() req) {
    if (req.user.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException('Access denied');
    }

    return {
      message: 'Welcome Super Admin',
    };
  }
}