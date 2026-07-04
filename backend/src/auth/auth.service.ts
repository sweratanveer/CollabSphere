import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(
      registerDto.email,
    );

    if (existingUser) {
      throw new BadRequestException(
        'Email already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      10,
    );

    const user = await this.usersService.create({
      fullName: registerDto.fullName,
      email: registerDto.email,
      password: hashedPassword,
      role: registerDto.role,
    });

   const { password, ...userWithoutPassword } = user;

return {
  message: 'User Registered Successfully',
  user: userWithoutPassword,
};
  }
   async login(loginDto: LoginDto) {

  }
}