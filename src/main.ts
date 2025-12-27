import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import secureEnv from 'secure-env';
import helmet from 'helmet';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
expressWinston.requestWhitelist.push('body');
expressWinston.responseWhitelist.push('body');
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ResponseHandler } from './common/dtoes/response.dto';
import { EncryptionDecryptionInterceptor } from './common/interceptors/encryption-decryption.interceptor';
import { EnvLog, PortLog } from './common/utils/string.constants';
import * as bodyParser from 'body-parser';


async function bootstrap() {

  let app: any = [];

  const logFormat = winston.format.printf(function (info:any) {
    let start = "\n======================== START REQUEST ================================"
    let time = `UTC Time: ${Date()} | India Time: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} | USA Time: ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}`
    let URL = `${info.level} ${info.message}`
    let Headers = `Headers: ${JSON.stringify(info.meta.req.headers, null, 0)}`
    let params = `Request Body: ${JSON.stringify(info.meta.req.body, null, 0)}`
    let resCode = `Response Code: ${info.meta.res.statusCode}`
    let resBody = `Response Body: ${JSON.stringify(info.meta.res.body, null, 0)}`
    let end = "======================== END REQUEST ==================================\n"
    return [start, time, URL, Headers, params, resCode, resBody, end].join("\n");
  });
  
  // Set up global.env BEFORE creating the NestJS application
  global.env = secureEnv({ secret: 'ECfgfdh9l36m67lf50HFGT2fy8b6a44', path: `src/config/env/${process.env.NODE_ENV}.env.enc` });

  app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  global['configService'] = configService;

  const env: string = configService.get('NODE_ENV');
  const port = configService.get('PORT');

  console.log(EnvLog, env);
  console.log(PortLog, port);

  app.use(bodyParser.json({ limit: '50mb' })); // Adjust the limit as needed
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true
  });

   app.use(expressWinston.logger({
    format: logFormat,
    transports: [
      new winston.transports.Console()
    ]

  }))

  app.use(helmet());
  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalInterceptors(new EncryptionDecryptionInterceptor(configService))

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result: any = errors.map((error: any) => (
          error.constraints[Object.keys(error.constraints)[0]]
        ));
        return ResponseHandler.sendBadRequest(result[0]);
      },
      stopAtFirstError: true,
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(port).then(() => {
    console.log(`🚀 Server ready at ${port}`);
  });

}
bootstrap();

