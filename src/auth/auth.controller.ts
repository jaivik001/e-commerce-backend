import { Request, Response, Body, Controller, Post, UseGuards, Res } from '@nestjs/common';
import { LoginSuccessfully, LoginBody, LoginErrorLog } from 'src/common/utils/string.constants';
import { ResponseHandler } from 'src/common/dtoes/response.dto';
import { AuthService } from './auth.service';


@Controller('api/v1/auth/')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post('login')
  async login(@Request() req: any, @Body() body: any, @Response() res: any) {
    try {
      console.log(LoginBody, body);
      let result = await this.authService.login(body);
      if (result) return ResponseHandler.sendResponse(LoginSuccessfully, result)
    } catch (error) {
      console.error(LoginErrorLog, error)
      ResponseHandler.sendError(error)
    }
  }

}
