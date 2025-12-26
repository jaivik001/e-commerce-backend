import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { SharedModule } from 'src/shared/shared.module';
import { HelperService } from 'src/common/helper/helper.service';
import { LocalStorageService } from './local/local-storage.service';

@Module({
  imports: [SharedModule],
  controllers: [MediaController],
  providers: [MediaService, HelperService, LocalStorageService],
  exports: [MediaService, LocalStorageService]
})
export class MediaModule {}
