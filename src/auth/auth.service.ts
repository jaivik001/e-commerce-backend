import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ResponseHandler } from 'src/common/dtoes/response.dto';
import { Status } from 'src/common/utils/enums/status.enum';
import { 
  AccountInactive, 
  InvalidMobileOrEmail, 
  InvalidPassword, 
  TokenAccessDenied,
  RequireEmail,
  RequirePassword
} from 'src/common/utils/string.constants';
import { UserService } from 'src/modules/user/user.service';



@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
  ) { }

  async validateUserById(userId: number) {
    let user = await this.userService.findOne(userId);
    if (user && user.deviceInfo.accessToken !== null && user.deviceInfo.isLogin === Status.YES) {
      return user;
    }else if(user && user.deviceInfo.accessToken === null && user.deviceInfo.isLogin === Status.NO){
      return TokenAccessDenied;
    }else{
      return null;
    }
  }

  async validateUser(identifier: string, password: string): Promise<any> {
    let user = await this.userService.findUser(identifier);

    if (!user) {
      return InvalidMobileOrEmail
    }

    if (user.isActive === Status.NO) {
      return AccountInactive
    }

    let isPassword = bcrypt.compareSync(password, user.password);
    if (!isPassword) {
      return InvalidPassword
    }

    if (user && isPassword) {
      const { password, ...result } = user.dataValues;
      return result
    }
  }

  async login(input: any) {
    try {

      if (!input.identifier) {
        ResponseHandler.sendValidationError(RequireEmail);
      }

      if (!input.password) {
        ResponseHandler.sendValidationError(RequirePassword);
      }


      let user = await this.validateUser(input.identifier, input.password)
      if (user === InvalidMobileOrEmail) {
        ResponseHandler.sendValidationError(InvalidMobileOrEmail)
      } else if (user === InvalidPassword) {
        ResponseHandler.sendValidationError(InvalidPassword)
      } else if (user === AccountInactive) {
        ResponseHandler.sendUnAuthorised(AccountInactive)
      }
     
      const payload = {
        sub: user.id,
        email: user.email,
      };
      const accessToken = this.jwtService.sign(payload, { secret: this.configService.get('JWT.KEY'), expiresIn: this.configService.get('JWT.EXPIRES_IN'), issuer: this.configService.get('JWT.ISSUER'), audience: this.configService.get('JWT.AUDIENCE') });
      await this.userService.addOrUpdateDevice({ ...input, userId: user.id, accessToken: accessToken });

      // if(user.isEmailVerified === Status.NO){
      //   // await this.userService.resendEmailOTP(user);
      // }

      return {
        user: user,
        accessToken: accessToken,
      }
    } catch (err) {
      throw err
     }
  }
}