import { Controller, Get, Post, Body, Param, Req, Res, UseGuards, Put, Headers, UseInterceptors, UploadedFile, Query, Delete, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/common/decorators/role.decorator';
import { DefaultRole } from 'src/common/utils/enums/role.enum';
import { ResponseHandler } from 'src/common/dtoes/response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminAccountCreatedSuccessfully, AdminAccountDeletedSuccessfully, AdminAccountInfo, AdminAccountInfos, AdminAccountUpdatedSuccessfully, DeviceInfo, DeviceInfoChangedSuccesssfully, LogoutSuccessfully, OtpSentSuccessfully, OtpVerificationInfo, PasswordChangedSuccesssfully, UserCreatedSuccessfully, UserInfo, UserProfileupdatedSuccessfully, UsersInfos, ContactInfoUpdatedSuccessfully, GetAllUsersError } from 'src/common/utils/string.constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { DeviceInfoDto } from './dto/device-info.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('api/v1/')
export class UserController {
  constructor(private readonly userService: UserService) { }


  @Post('users')
  async userRegistration(@Body() createUserDto: CreateUserDto) {
    try {
      let result = await this.userService.userRegistration(createUserDto)
      if (result) return ResponseHandler.sendResponse(UserCreatedSuccessfully, result)
    } catch (err) {
      console.error('| User Registration Error : ', err);
      ResponseHandler.sendError(err);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Req() req: any, @Body() changePasswordDto: ChangePasswordDto) {
    try {
      const { oldPassword, newPassword } = changePasswordDto;
      let result = await this.userService.changePassword(req.user.id, oldPassword, newPassword);
      return ResponseHandler.sendResponse(PasswordChangedSuccesssfully, result)
    } catch (error) {
      console.error('| changePassword error: ', error)
      ResponseHandler.sendError(error)
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      let result = await this.userService.forgotPassword(forgotPasswordDto.email);
      return ResponseHandler.sendResponse(result, null);
    } catch (error) {
      console.error('| forgotPassword error: ', error)
      ResponseHandler.sendError(error)
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {
      const { passwordResetToken, password } = resetPasswordDto;
      let result = await this.userService.resetPassword(passwordResetToken, password);
      return ResponseHandler.sendResponse(PasswordChangedSuccesssfully, result)
    } catch (error) {
      console.error('| resetPassword error: ', error)
      ResponseHandler.sendError(error)
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(DefaultRole.USER, DefaultRole.SUPER_ADMIN)
  @Post('user/logout')
  async logout(@Req() req: any) {
    try {
      let result = await this.userService.logout(+req.user.id);
      if (result) return ResponseHandler.sendResponse(LogoutSuccessfully, null)
    } catch (error) {
      console.error('| Logout error: ', error)
      ResponseHandler.sendError(error)
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(DefaultRole.USER, DefaultRole.SUPER_ADMIN)
  @Get('users/profile')
  async getUsersById(@Req() req: any) {
    try {
      let result = await this.userService.getUserById(+req.user.id);
      if (result) return ResponseHandler.sendResponse(UserInfo, result);
    } catch (err) {
      console.error('| Get User by Id Error : ', err);
      ResponseHandler.sendError(err);
    }
  }

  @Post('users/device-info')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(DefaultRole.USER)
  async updateDeviceInfo(@Req() req: any, @Body() deviceInfoDto: DeviceInfoDto) {
    try {
      deviceInfoDto.userId = req.user.id;
      let result = await this.userService.addOrUpdateDevice(deviceInfoDto);
      return ResponseHandler.sendResponse(DeviceInfoChangedSuccesssfully, result)
    } catch (error) {
      console.error('| updateDeviceInfo error: ', error)
      ResponseHandler.sendError(error)
    }
  }

  @Post('users/verify-otps')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(DefaultRole.USER)
  async verifyOTPs(@Req() req: any, @Body() body: any) {
    try {
      let { message, ...result }: any = await this.userService.verifyOTP(body.emailOTP, req.user)
      let m = message !== null ? message : OtpVerificationInfo;
      return ResponseHandler.sendResponse(m, result)
    } catch (error) {
      console.error('| verifyOTPs error: ', error)
      ResponseHandler.sendError(error)
    }
  }

  @Post('users/resend-email-otp')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(DefaultRole.USER)
  async resendEmailOTP(@Req() req: any) {
    try {
      let result = await this.userService.resendEmailOTP(req.user)
      return ResponseHandler.sendResponse(OtpSentSuccessfully, result)
    } catch (error) {
      console.error('| Resend email OTP error: ', error)
      ResponseHandler.sendError(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @Roles(DefaultRole.USER)
  @Patch('users')
  async updateUserProfile(@Req() req: any, @Body() userDto: any, @UploadedFile() avatar: any, @Res() res: any) {
    userDto.updatedByUserId = Number(req.user.id)
    let result = await this.userService.updateUser(+req.user.id, userDto, avatar);
    ResponseHandler.sendSuccess(UserProfileupdatedSuccessfully, result, res)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(DefaultRole.USER, DefaultRole.SUPER_ADMIN)
  @Get('users/device-info')
  async getDeviceInfo(@Req() req: any) {
    try {
      let result = await this.userService.getDeviceInfo(+req.user.id);
      if (result) return ResponseHandler.sendResponse(DeviceInfo, result);
    } catch (err) {
      console.error('| Get Device Info Error : ', err);
      ResponseHandler.sendError(err);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(DefaultRole.SUPER_ADMIN)
  @Get('users')
  async getAllUsers(@Req() req: any, @Query() query: any) {
    try {
      let result = await this.userService.getUsers(query)
      return ResponseHandler.sendResponse(UsersInfos, result)
    } catch (error) {
      console.error(GetAllUsersError, error);
      ResponseHandler.sendError(error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(DefaultRole.USER)
  @Patch('users/change-contact')
  async updateContactInfo(@Req() req: any, @Body() updateContactDto: { email?: string, mobileNo?: string, mobileNoCountryCode?: string }) {
    try {
      let result = await this.userService.changeEmail(req.user.id, updateContactDto)
      if (result) return ResponseHandler.sendResponse(ContactInfoUpdatedSuccessfully, result)
    } catch (err) {
      console.error('| Change Contact Info Error : ', err);
      ResponseHandler.sendError(err);
    }
  }

}
