import { IsString, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  passwordResetToken: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}