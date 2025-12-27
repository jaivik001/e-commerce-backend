import { Module } from '@nestjs/common';
import { HelperService } from './helper.service';

@Module({
  imports: [],
  controllers: [],
  providers: [HelperService]
})
export class HelperModule {}