import { IsString, IsInt, IsOptional, IsDate, IsBoolean, Length, isEnum, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { DevicePlatform } from 'src/common/utils/enums/status.enum';

export class DeviceInfoDto {
  @IsOptional()
  @IsInt()
  readonly id?: number;

  @IsOptional()
  @IsInt()
  readonly isLogin?: number;

  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsString()
  @IsEnum(DevicePlatform)
  readonly devicePlatform?: string;

  @IsOptional()
  @IsString()
  readonly deviceToken?: string;

  @IsOptional()
  @IsString()
  readonly deviceUniqueId?: string;

  @IsOptional()
  @IsString()
  readonly deviceModel?: string;

  @IsOptional()
  @IsString()
  readonly os?: string;

  @IsOptional()
  @IsString()
  readonly accessToken?: string;

  @IsOptional()
  @IsString()
  @Length(0, 50)
  readonly appVersion?: string;

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
