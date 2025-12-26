import { ExecutionContext, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseHandler } from 'src/common/dtoes/response.dto';
import { InvalidTokenSignature, TokenRequired } from 'src/common/utils/string.constants';


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any) {
        if (info == 'Error: No auth token') {
            ResponseHandler.sendUnAuthorised(TokenRequired)
        } else if (info?.name == 'JsonWebTokenError') {
            ResponseHandler.sendUnAuthorised(InvalidTokenSignature)
        } else if (err?.status == HttpStatus.UNAUTHORIZED) {
            ResponseHandler.sendUnAuthorised(err?.message)
        } else if (info?.name == 'TokenExpiredError'){
            ResponseHandler.sendUnAuthorised(info.message)
        } else {
            return user;
        }
    }
}
