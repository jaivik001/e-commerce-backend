import { IsString, IsInt, IsOptional, IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSubCategoryDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsInt()
    @IsNotEmpty()
    readonly categoryId: number;

    @IsString()
    @IsOptional()
    readonly slug: string;

    @IsString()
    @IsOptional()
    readonly desc?: string;

    @IsInt()
    @IsOptional()
    readonly createdByUserId: number;

    @IsInt()
    @IsOptional()
    readonly updatedByUserId?: number;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    readonly createdAt?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    readonly updatedAt?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    readonly deletedAt?: Date;
}