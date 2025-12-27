import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AccountNotExists, InvalidTokenSignature, TokenAccessDenied, PayloadLog } from "src/common/utils/string.constants";
import { ResponseHandler } from "src/common/dtoes/response.dto";
import { AuthService } from "../auth.service";



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  token: string = ''
  constructor(
    private authService: AuthService,
    configService: ConfigService,

  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT.KEY'),
      algorithms:  configService.get('ALGORITHM'), 
    });
  }

  async validate(payload: any) {
    console.log(PayloadLog, payload)
    let result:any = await this.authService.validateUserById(payload.sub);

    if (result === TokenAccessDenied) {
      return ResponseHandler.sendUnAuthorised(TokenAccessDenied)
    } else if(result) {
      return result;
    } else {
      return ResponseHandler.sendUnAuthorised(AccountNotExists)
    }
  }
}