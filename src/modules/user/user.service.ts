import { Injectable } from '@nestjs/common';
import { User } from 'src/shared/tables/postgres-tables/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from 'src/shared/tables/postgres-tables/role.entity';
import { DeviceInfo } from 'src/shared/tables/postgres-tables/device-info.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import moment from 'moment';
import { HelperService } from 'src/common/helper/helper.service';
import { ConfigService } from '@nestjs/config';
import { ResponseHandler } from 'src/common/dtoes/response.dto';
import { AuthProvider, Status } from 'src/common/utils/enums/status.enum';
import { DefaultRole } from 'src/common/utils/enums/role.enum';
import { Media } from 'src/shared/tables/postgres-tables/media.entity';
import { CreateUserDto } from './dto/create-user.dto';
import {
  UserAlreadyExist,
  EmailAlreadyExist,
  UserDoesNotFound,
  IncorrectOldPassword,
  ResetPasswordSubject,
  PwdResetLinkExpiry,
  ResetPasswordLinkMsg,
  PasswordResetLinkAlreadyUsed,
  PasswordResetTokenIsExpire,
  UserDoesNotExist,
  RequireUserId,
  InvalidRoleSlug,
  EmailVerification,
  EmailOtpExpired,
  EmailOtpInvalid,
  UnsupportedAuthenticationProvider,
  RequireEmail,
  DeviceInfoDoesNotExist,
  ResetPasswordTemplate,
  OtpTemplate,
  AppleAuthNotImplemented,
  MobileOtpInvalid,
  MyAccount,
  MobileNoAlreadyExist
} from 'src/common/utils/string.constants';
import { JwtService } from '@nestjs/jwt';
import { Op, Transaction, where } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { OtpExpiry, PageSize } from 'src/common/utils/constants';
import { MediaService } from '../media/media.service';
import { MailService } from '../mail/mail.service';
import { UserOTPModel } from 'src/common/utils/model.constants';
import { UserOTP } from 'src/shared/tables/postgres-tables/user-opts.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Role) private roleModel: typeof Role,
    @InjectModel(DeviceInfo) private deviceInfoModel: typeof DeviceInfo,
    @InjectModel(UserOTP) private userOTPModel: typeof UserOTP,
    private readonly helperService: HelperService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly mediaService: MediaService,
    private jwtService: JwtService,
    private readonly sequelize: Sequelize
  ) {
  }

  findOne(id: number) {
    try {
      return this.userModel.findOne({
        where: { id: id }, include: [{
          model: Role,
          attributes: ['id', 'name', 'slug'],
        },
        {
          model: DeviceInfo
        }
        ]
      })
    } catch (error) {
      throw error;
    }
  }

  findByEmail(email: string) {
    try {
      return this.userModel.findOne({
        where: { email: email },
        include: [{
          model: Role,
          attributes: ['id', 'name', 'slug'],
        },
        ]
      })
    } catch (error) {
      throw error;
    }
  }

  async addOrUpdateDevice(input: any, transaction?: Transaction) {
    try {
      const [deviceInfo, created] = await this.deviceInfoModel.upsert(
        {
          userId: input.userId,
          devicePlatform: input.devicePlatform,
          deviceToken: input.deviceToken,
          deviceUniqueId: input.deviceUniqueId,
          deviceModel: input.deviceModel,
          appVersion: input.appVersion,
          accessToken: input.accessToken,
          os: input.os,
          isLogin: +input.isLogin,
        },
        { transaction, returning: true }
      );

      return deviceInfo;
    } catch (err) {
      throw err
    }
  }

  async findUser(identifier: string) {
    try {
      let query: any
      const isEmail = this.isEmail(identifier);
      if (isEmail) {
        query = { email: identifier }
      } else {
        query = { mobileNo: identifier }
      }

      let result = await this.userModel.findOne({
        where: query,
        include: [{
          model: Role,
          attributes: ['id', 'name', 'slug'],
        },
        {
          model: Media,
          as: 'avatar',
          attributes: ['id', 'originalName', 'fileName', 'destination', 'path', 'mimeType', 'size']
        }
        ]
      })
      return result

    } catch (error) {
      throw error;
    }
  }

  isEmail(username: string): boolean {
    // Regular expression to validate an email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if the provided username matches the email format
    return emailRegex.test(username);
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    try {
      const user: any = await this.userModel.findByPk(userId);
      if (!user) {
        ResponseHandler.sendNotFound(UserDoesNotFound)
      }

      const passwordIsValid = await bcrypt.compare(oldPassword, user.dataValues.password);

      if (!passwordIsValid) {
        ResponseHandler.sendValidationError(IncorrectOldPassword)
      }

      user.password = await bcrypt.hash(newPassword, 8);
      await user.save();

      let { password, ...userData } = user.dataValues;
      return userData;

    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email: string) {
    try {

      let user: any = await this.userModel.findOne({ where: { email: email } });

      if (!user) {
        ResponseHandler.sendNotFound(UserDoesNotFound)
      }

      user.passwordResetToken = crypto.randomBytes(50).toString('hex'),
        user.passwordResetTokenExpiry = moment().add(1, 'day').toDate(),
        await user.save();

      const link = `${this.configService.get('FRONTEND_URL')}/reset-password/${user.passwordResetToken}`;
      let attachments = [
        {
          filename: 'logo.png',
          path: 'src/public/logo.png',
          cid: 'logo'
        },
      ]
      await this.mailService.sendMail(user.dataValues.email, ResetPasswordSubject, ResetPasswordTemplate, { name: user.dataValues.name, resetPasswordLinkExpiry: PwdResetLinkExpiry, link: link }, attachments)
      return ResetPasswordLinkMsg;

    } catch (error) {
      throw error;
    }
  }

  async resetPassword(passwordResetToken: string, newPassword: string) {
    try {

      const user: any = await this.userModel.findOne({ where: { passwordResetToken: passwordResetToken } });

      if (!user) {
        ResponseHandler.sendNotFound(PasswordResetLinkAlreadyUsed)
      } else if (moment(user.dataValues.passwordResetTokenExpiry) < moment()) {
        ResponseHandler.sendValidationError(PasswordResetTokenIsExpire)
      }

      user.password = await bcrypt.hash(newPassword, 8),
        user.passwordResetToken = null,
        user.passwordResetTokenExpiry = null
      await user.save();

      let { password, ...userData } = user.dataValues;
      return userData;
    } catch (error) {
      throw error;
    }
  }

  async logout(userId: number) {
    try {
      let device: any = await this.deviceInfoModel.findOne({ where: { userId: userId } })
      if (!device) ResponseHandler.sendNotFound(UserDoesNotExist)
      device.isLogin = Status.NO
      device.accessToken = null
      return await device.save()
    } catch (error) {
      throw error;
    }
  }

  async addUser(createUserDto: CreateUserDto, roleId: number, avatarId?: any, transaction?: Transaction) {
    let user: any = await this.userModel.create({
      email: createUserDto.email,
      password: createUserDto.password ? await bcrypt.hash(createUserDto.password, 8) : null,
      name: createUserDto.name,
      mobileNoCountryCode: createUserDto.mobileNoCountryCode,
      mobileNo: createUserDto.mobileNo,
      avatarId: avatarId ? +avatarId : null,
      authProvider: createUserDto.authProvider,
      isActive: createUserDto.isActive ? +createUserDto.isActive : Status.YES,
      roleId: roleId,
      createdByUserId: createUserDto.createdByUserId,
    }, { transaction: transaction });
    return user;
  }

  async updateUser(userId: number, updateData: any, file: any) {
    const transaction = await this.sequelize.transaction();
    try {
      let media: any;
      if (file) {
        media = await this.mediaService.saveMedia(file, transaction);
      }

      const user = await this.userModel.findByPk(userId, { transaction });
      if (!user) {
        await transaction.rollback();
        return ResponseHandler.sendNotFound(UserDoesNotExist);
      }

      for (const key in updateData) {
        if (this.helperService.isNotEmpty(updateData[key]) && key !== 'password' && key !== 'email' && key !== 'mobileNo') {
          user[key] = updateData[key];
        }
      }

      if (file) {
        if (user.avatarId) await this.mediaService.deleteMedia(user.avatarId, transaction);
        user.avatarId = +media.id;
      }

      let result: any = await user.save({ transaction });
      await transaction.commit();
      result.dataValues.avatar = await user.$get('avatar');
      let { password, ...userData } = result.dataValues;
      return userData;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async userRegistration(createUserDto: CreateUserDto) {
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      let user: any;
      user = await this.userModel.findOne({ where: { [Op.or]: [{ mobileNo: createUserDto.mobileNo }, { email: createUserDto.email }] }, transaction: transaction });
      if (user) {
        if (user?.dataValues.email === createUserDto.email && user?.dataValues.mobileNo === createUserDto.mobileNo) {
          return ResponseHandler.sendFound(UserAlreadyExist);
        } else if (user?.dataValues.email === createUserDto.email) {
          return ResponseHandler.sendFound(EmailAlreadyExist);
        }
      }

      let role: any = await this.getRole(DefaultRole.USER)
      let userResult = await this.addUser(createUserDto, role.id, null, transaction);
      userResult.dataValues.role = await userResult.$get('role', { attributes: ['id', 'name', 'slug'] })
      const payload = {
        sub: userResult.id,
        email: userResult.dataValues.email,
      };
      const accessToken: string = this.jwtService.sign(payload, { secret: this.configService.get('JWT.KEY'), expiresIn: this.configService.get('JWT.EXPIRES_IN') });
      await this.addOrUpdateDevice({ ...createUserDto, userId: userResult.id, accessToken: accessToken }, transaction);

      await transaction.commit();
      this.generateOTP(userResult)
      let { password, ...userData } = userResult.dataValues;
      return {
        user: userData,
        accessToken: accessToken
      }
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async getRole(slug: string) {
    try {
      let role = await this.roleModel.findOne({ where: { slug: slug } })
      if (!role) ResponseHandler.sendBadRequest(InvalidRoleSlug);
      return role
    } catch (err) {
      throw err;
    }
  }

  async getUserById(userId: number) {
    try {
      if (!userId) return ResponseHandler.sendBadRequest(RequireUserId)
      let user = await this.userModel.findByPk(userId, {
        include: [
          {
            model: Role,
            attributes: ['id', 'name', 'slug'],
          },
          {
            model: Media,
            as: 'avatar'
          }
        ]
      });
      if (!user) return ResponseHandler.sendNotFound(UserDoesNotExist)
      let { password, ...userData } = user.dataValues;
      return userData;

    } catch (error) {
      throw error
    }
  }

  async generateOTP(user: any) {
    try {
      let emailRes: any = await this.generateEmailOTP(user.id, user.email, user.name)
      if (emailRes.isOTPSent) {
        return { isOTPSent: Status.YES }
      }
    } catch (err) {
      throw err;
    }
  }

  async verifyOTP(emailOTP: string, user: any) {
    try {
      let isEmailOTPVerified = user.isEmailOTPVerified;
      let messsage: string = '';
      if (emailOTP) {
        let emailOTPResult: any = await this.verifyEmailOTP(emailOTP, user)
        if (emailOTPResult.verified) {
          isEmailOTPVerified = Status.YES
          user.isEmailOTPVerified = Status.YES
          await user.save()
        } else {
          isEmailOTPVerified = Status.NO
          messsage = emailOTPResult.message
        }
      }

      return {
        isEmailOTPVerified,
        message: messsage
      }
    } catch (err) {
      throw err;
    }
  }

  async generateEmailOTP(userId: number, email: string, name: string) {
    try {
      let emailOTP = await this.helperService.generateOTP()
      let attachments = [
        {
          filename: 'logo.png',
          path: 'src/public/logo.png',
          cid: 'logo'
        },
      ]
      let result = await this.mailService.sendMail(email, EmailVerification, OtpTemplate, { otp: emailOTP, name: name, expiry_minutes: OtpExpiry }, attachments)
      if (result.response) {
        // await this.userOTPModel.upsert({
        //   userId: userId,
        //   otp: emailOTP,
        //   expiresAt: moment().add(OtpExpiry, 'minutes').toDate()
        // })
        return { isOTPSent: true }
      } else {
        return { isOTPSent: false }
      }
    } catch (error) {
      throw error;
    }
  }

  async verifyEmailOTP(emailOTP: string, user: any) {
    try {
      let emailOTPData: any = await this.userOTPModel.findOne({ where: { userId: user.id, expiresAt: { [Op.gte]: moment().toDate() } } })
      if (!emailOTPData) {
        return { verified: false, message: EmailOtpExpired }
      }

      if (emailOTPData.otp !== emailOTP) {
        return { message: EmailOtpInvalid }
      }

      // await this.userOTPModel.destroy({ where: { userId: user.id } })
      return { verified: true }
    } catch (error) {
      throw error;
    }
  }

  async resendEmailOTP(user: any) {
    try {
      let emailRes = await this.generateEmailOTP(user.id, user.email, user.name)
      return { isEmailOTPSent: emailRes.isOTPSent === true ? Status.YES : Status.NO }
    } catch (error) {
      throw error
    }
  }

  async getUsers(params: any) {
    let pageNo: number = 1
    let pageSize: number = PageSize
    let offset: number = 0
    let keywordQuery: any
    const role: any = await this.getRole(DefaultRole.USER)

    let queryArray = [{ roleId: role.id }]

    if (params.isPagination == 1) {
      pageNo = params.pageNo ? params.pageNo : 1;
      pageSize = params.pageSize ? parseInt(params.pageSize) : PageSize;
      offset = (pageNo - 1) * pageSize
    }

    if (this.helperService.isNotEmpty(params.keyword)) {
      keywordQuery = {
        [Op.or]: [
          { 'name': { [Op.iLike]: `%${params.keyword}%` } },
          { 'email': { [Op.iLike]: `%${params.keyword}%` } },
        ]
      }
      queryArray.push(keywordQuery)
    }

    let query = { [Op.and]: queryArray }
    let finalQuery: any = params.isPagination ? {
      where: query,
      attributes: ['id', 'name', 'mobileNoCountryCode', 'mobileNo', 'email', 'isActive', 'createdAt', 'updatedAt'],
      offset: offset,
      limit: pageSize,
      order: [['updatedAt', 'DESC']]
    } : {
      where: query,
      attributes: ['id', 'name', 'mobileNoCountryCode', 'mobileNo', 'email', 'isActive', 'createdAt', 'updatedAt'],
      order: [['updatedAt', 'DESC']]
    }
    let users = await this.userModel.findAndCountAll(finalQuery);
    return { total: users.count, users: users.rows }
  }

  async changeEmail(userId: number, updateData: any) {
    try {
      let user: any = await this.userModel.findByPk(userId);
      if (!user) return ResponseHandler.sendNotFound(UserDoesNotExist);

      if (updateData?.email) {
        if (!this.helperService.isNotEmpty(updateData.email)) {
          return ResponseHandler.sendValidationError(RequireEmail);
        }

        const existingEmailUser = await this.userModel.findOne({
          where: {
            email: updateData.email,
            id: { [Op.ne]: userId },
          },
        });
        if (existingEmailUser) {
          return ResponseHandler.sendFound(EmailAlreadyExist);
        }
        user.email = updateData.email;
        user.isEmailOTPVerified = Status.NO;
        user = await user.save();
        await this.generateEmailOTP(user.id, user.email, user.name);
      }

      let { password, ...userData } = user.dataValues;
      return userData;
    } catch (error) {
      throw error;
    }
  }

  async getDeviceInfo(userId: number) {
    try {
      if (!userId) return ResponseHandler.sendBadRequest(RequireUserId)
      let deviceInfo = await this.deviceInfoModel.findOne({ where: { userId } });
      if (!deviceInfo) return ResponseHandler.sendNotFound(DeviceInfoDoesNotExist)
      return deviceInfo;
    } catch (error) {
      throw error
    }
  }
}