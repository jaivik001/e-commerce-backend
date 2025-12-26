import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadRequestException,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { ResponseHandler } from '../dtoes/response.dto';
import { ErrorWhileEncryptionDecryption, SkippingDecryptionLog } from '../utils/string.constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EncryptionDecryptionInterceptor implements NestInterceptor {
    private readonly algorithm: any;
    private readonly key: Buffer;
    private readonly encrypt: boolean;

    constructor(private readonly configService: ConfigService) {
        this.algorithm = this.configService.get<string>('ENCRYPTION_DECRYPTION.ALGORITHM');
        this.key = Buffer.from(this.configService.get<string>('ENCRYPTION_DECRYPTION.KEY')!, 'hex');
        this.encrypt = this.configService.get<string>('ENCRYPTION_DECRYPTION.ENCRYPT') === 'true';
    }

    intercept(context: ExecutionContext, next: CallHandler): any {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        try {

            const contentType = request.headers['content-type'] || '';

            if (contentType.includes('multipart/form-data')) {
                console.log(SkippingDecryptionLog);
            } else if (request.body?.data && this.encrypt) {
                const encryptedBody = request.body.data;
                const decryptedBody = ResponseHandler.symDecrypt(encryptedBody, this.algorithm, this.key);
                request.body = JSON.parse(decryptedBody);
            } else {
                request.body = request.body?.data;
            }

            return next.handle().pipe(
                map((data) => {
                    if (data) {
                        if (this.encrypt) {
                            const encryptedData = ResponseHandler.symEncrypt(
                                JSON.stringify(data.result),
                                this.algorithm,
                                this.key,
                            );
                            return ResponseHandler.sendSuccess(data.message, encryptedData, response);
                        } else {
                            return ResponseHandler.sendSuccess(data.message, data.result, response);
                        }
                    }
                    return
                }),
            );
        } catch (error) {
            throw ResponseHandler.sendBadRequest(ErrorWhileEncryptionDecryption);
        }
    }
}
