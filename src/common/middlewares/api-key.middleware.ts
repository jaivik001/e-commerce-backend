import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { ResponseHandler } from '../dtoes/response.dto';
import { InvalidApiKeyLog, InvalidApiKey } from '../utils/string.constants';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== global.env.SERVER_API_KEY) {
      console.log(InvalidApiKeyLog)
      return ResponseHandler.sendUnAuthorised(InvalidApiKey)
    }

    next();
  }
}
