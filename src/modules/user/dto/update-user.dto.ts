
import { IsString, IsInt, IsOptional, IsEmail, IsDate, IsArray, IsBoolean, Length, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRolePermissionsDto } from './create-user.dto';
import { AuthProvider } from 'src/common/utils/enums/status.enum';
import { Is } from 'sequelize-typescript';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly username?: string;

  @IsOptional()
  @IsString()
  readonly mobileNoCountryCode?: string;

  @IsOptional()
  @IsString()
  readonly mobileNo?: string;

  @IsString()
  readonly gender: string;

  @IsString()
  @Length(0, 200)
  readonly address: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsInt()
  readonly roleId?: number;

  @IsOptional()
  @IsInt()
  readonly avatarId?: number;

  @IsOptional()
  @IsInt()
  readonly createdByUserId?: number;

  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly isAdmin?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly isLoggedIn?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly isFirstTimeLogin?: boolean;

  @IsOptional()
  @IsInt()
  updatedByUserId: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly deletedAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly createdAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly updatedAt?: Date;
}

export class UpdateAdminDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  readonly mobileNoCountryCode: string;

  @IsString()
  readonly mobileNo: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsInt()
  @IsOptional()
  readonly roleId: number;
  
  @IsString() 
  @IsOptional()
  @IsEnum([AuthProvider.MANUAL, AuthProvider.GOOGLE])
  authProvider: string;

  @IsInt()
  @IsOptional()
  readonly createdByUserId: number;

  @IsInt()
  @IsOptional()
  updatedByUserId: number;

  @IsNumber()
  @IsOptional()
  readonly isActive: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly deletedAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly createdAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly updatedAt?: Date;
}