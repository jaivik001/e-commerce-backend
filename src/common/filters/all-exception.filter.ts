import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { HttpError } from '../utils/enums/errors.enum';


@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    let info: any =
      exception instanceof HttpException ? exception.getResponse() : [];
    response.status(status).json({
      error: true,
      statusCode: info.statusCode
        ? info.statusCode
        : HttpStatus.INTERNAL_SERVER_ERROR,
      errorType: info.errorType ? info.errorType : HttpError.GENERIC_ERROR,
      message: info.message ? info.message : HttpError.INTERNAL_SERVER_ERROR,
      data: info.data ? info.data : null,
    });
  }
}
export class errorHandler {
  public sendError(error, msg?: string) {
    throw new HttpException({ message: msg, details: error }, HttpStatus.OK);
  }
}
