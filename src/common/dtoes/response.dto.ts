import { HttpException, HttpStatus, } from '@nestjs/common';
import { HttpError } from '../utils/enums/errors.enum';
import * as crypto from 'crypto';


export class ResponseHandler {
    public static symEncrypt(text: string, algorithm, key): string {
        let iv = Buffer.from(crypto.randomBytes(16));
        console.log('Generated IV:', iv.toString('hex'), 'Length:', iv.length);

        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(text, 'utf8', 'base64');
        encrypted += cipher.final('base64');

        return `${iv.toString('hex')}:${encrypted}`;
    }

    public static symDecrypt(encryptedText: string, algorithm, key) {
        const [ivHex, encrypted] = encryptedText.split(':');
        const iv = Buffer.from(ivHex, 'hex');

        console.log('Received IV:', iv.toString('hex'), 'Length:', iv.length);

        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encrypted, 'base64', 'utf8');
        console.log(decrypted);
        decrypted += decipher.final('utf8');
        return decrypted;
    }

  public static sendSuccess(message: string, data: any, res: any): any {
    res.status(HttpStatus.OK).json({
      error: false,
      statusCode: HttpStatus.OK,
      message: message,
      data: data,
    });
  }

  public static sendCreated(message: string, data: any, res: any): any {
    res.status(HttpStatus.CREATED).json({
      error: false,
      statusCode: HttpStatus.CREATED,
      message: message,
      data: data,
    });
  }

  public static sendFound(message: string): any {
    throw new HttpException(
      {
        statusCode: HttpStatus.FOUND,
        errorType: HttpError.FOUND,
        message: message,
        data: null,
      },
      HttpStatus.FOUND,
    );
  }

  public static sendNotFound(message: string, errorType?: string): any {
    throw new HttpException(
      {
        statusCode: HttpStatus.NOT_FOUND,
        errorType: HttpError.NOT_FOUND,
        message: message,
        data: null,
      },
      HttpStatus.NOT_FOUND,
    );
  }

  public static sendBadRequest(message: string): any {
    throw new HttpException(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        errorType: HttpError.BAD_REQUEST,
        message: message,
        data: null,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  public static sendUnAuthorised(message: string): any {
    throw new HttpException(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        errorType: HttpError.UNAUTHORIZED,
        message: message,
        data: null,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }

  public static sendForbidden(message: string): any {
    throw new HttpException(
      {
        statusCode: HttpStatus.FORBIDDEN,
        errorType: HttpError.FORBIDDEN,
        message: message,
        data: null,
      },
      HttpStatus.FORBIDDEN,
    );
  }

  public static sendInternalServerError(message: string): any {
    throw new HttpException(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorType: HttpError.INTERNAL_SERVER_ERROR,
        message: message,
        data: null,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  public static sendValidationError(message: string): any {
    throw new HttpException(
      {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        errorType: HttpError.VALIDATION_ERROR,
        message: message,
        data: null,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }

  public static sendOTPRateLimitError(message: string): any {
    throw new HttpException(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        errorType: HttpError.VALIDATION_ERROR,
        message: message,
        data: null,
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }

  public static sendError(err: any) {
    switch (err.status) {
      case HttpStatus.UNPROCESSABLE_ENTITY:
        this.sendValidationError(err.message);
        break;
      case HttpStatus.INTERNAL_SERVER_ERROR:
        this.sendInternalServerError(err.message);
        break;
      case HttpStatus.FORBIDDEN:
        this.sendForbidden(err.message);
        break;
      case HttpStatus.UNAUTHORIZED:
        this.sendUnAuthorised(err.message);
        break;
      case HttpStatus.BAD_REQUEST:
        this.sendBadRequest(err.message);
        break;
      case HttpStatus.NOT_FOUND:
        this.sendNotFound(err.message,);
        break;
      case HttpStatus.FOUND:
        this.sendFound(err.message);
        break;
      case HttpStatus.TOO_MANY_REQUESTS:
        this.sendOTPRateLimitError(err.message);
        break;
      default:
        this.sendInternalServerError(err.message);
        break;
    }
  }

  public static sendResponse(message: string, result: any) {
    return { result, message }
  }
}
