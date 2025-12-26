import { IsString, IsInt, IsOptional, IsEmail, IsDate, IsArray, IsBoolean, IsNumber, IsNotEmpty, Length, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { AuthProvider } from 'src/common/utils/enums/status.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly mobileNoCountryCode: string;

  @IsString()
  @IsNotEmpty()
  readonly mobileNo: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsString()
  @IsEnum([AuthProvider.MANUAL, AuthProvider.GOOGLE])
  @IsNotEmpty()
  readonly authProvider: string;

  @IsInt()
  @IsOptional()
  readonly roleId: number;

  @IsInt()
  @IsOptional()
  readonly createdByUserId: number;

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

export class UserRolePermissionsDto {
  @IsInt()
  @IsOptional()
  id: number;

  @IsInt()
  @IsOptional()
  userId: number;

  @IsInt()
  rolePermissionId: number;

  @IsInt()
  accessLevelId: number

  @IsInt()
  isEnabled: number
}

export class CreateAdminDto {
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
  createdByUserId: number;

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

