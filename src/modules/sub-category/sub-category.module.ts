import { Module } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryController } from './sub-category.controller';
import { SharedModule } from 'src/shared/shared.module';
import { HelperService } from 'src/common/helper/helper.service';

@Module({
  imports: [SharedModule],
  controllers: [SubCategoryController],
  providers: [SubCategoryService,
    HelperService
  ],
  exports: [SubCategoryService]
})
export class SubCategoryModule {}
