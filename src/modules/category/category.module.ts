import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { SharedModule } from 'src/shared/shared.module';
import { HelperService } from 'src/common/helper/helper.service';

@Module({
  imports: [SharedModule],
  controllers: [CategoryController],
  providers: [CategoryService, HelperService],
  exports: [CategoryService]
})
export class CategoryModule {}
