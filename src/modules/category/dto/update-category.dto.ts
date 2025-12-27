import { IsString, IsOptional, IsNotEmpty, IsInt } from 'class-validator';
export class UpdateCategoryDto {
  @IsInt()
  @IsNotEmpty()
  readonly id: number;  

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsOptional() 
  readonly desc?: string;

  @IsString()
  @IsOptional()
  readonly slug?: string;

  @IsInt()
  @IsOptional()
  readonly isActive?: number;

  @IsOptional()
  readonly updatedByUserId?: number;
}