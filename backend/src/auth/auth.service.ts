import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { Role } from '../common/enums/role.enum';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Company } from '../company/entities/company.entity';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if email already exists
    const existingUser = await this.usersService.findByEmail(
      registerDto.email,
    );

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Find company (optional)
    let company: Company | null = null;

    if (registerDto.companyId) {
      company = await this.usersService.findCompanyById(
        registerDto.companyId,
      );

      if (!company) {
        throw new BadRequestException('Company not found');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      10,
    );

    // Create user
    const user = await this.usersService.create({
      fullName: registerDto.fullName,
      email: registerDto.email,
      password: hashedPassword,
      role: registerDto.role ?? Role.EMPLOYEE,
      company,
    });

    const { password, ...userWithoutPassword } = user;

    return {
      message: 'User Registered Successfully',
      user: userWithoutPassword,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(
      loginDto.email,
    );

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const isPasswordMatched = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.company?.id ?? null,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    const { password, ...userWithoutPassword } = user;

    return {
      message: 'Login Successful',
      accessToken,
      user: userWithoutPassword,
    };
  }
}