import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SharedModule } from 'src/shared/shared.module';
import { HelperService } from 'src/common/helper/helper.service';
import { MailModule } from '../mail/mail.module';
import { MediaModule } from '../media/media.module';
import { multerConfig } from '../media/multer/multer.config';
import { MulterModule } from '@nestjs/platform-express';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SharedModule,
    MediaModule,
    MailModule,
    MulterModule.register(multerConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): any => ({
        secret: config.getOrThrow<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: config.getOrThrow<string>('JWT_EXPIRES_IN'),
        },
      }),
    })
  ],
  controllers: [UserController],
  providers: [UserService, HelperService],
  exports: [UserService]
})
export class UserModule { }
