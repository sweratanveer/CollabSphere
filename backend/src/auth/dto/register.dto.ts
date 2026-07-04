import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

import { Role } from '../../common/enums/role.enum';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;

  @IsEnum(Role)
  role!: Role;
}