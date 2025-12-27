import { IsString, IsOptional, IsNotEmpty, IsInt } from 'class-validator';
import { IsIn } from 'sequelize-typescript';
export class UpdateSubCategoryDto {
  @IsInt()
  @IsNotEmpty()
  readonly id: number;  

  @IsInt()
  @IsNotEmpty()
  readonly categoryId: number

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