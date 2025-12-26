import { Controller, Delete, Param, Res, UseGuards } from '@nestjs/common';
import { MediaService } from './media.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ResponseHandler } from 'src/common/dtoes/response.dto';
import { FileDeleted } from 'src/common/utils/string.constants';

@Controller('api/v1/')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Delete('media/:id')
  @UseGuards(JwtAuthGuard)
  async deleteMedia(@Param('id') id: string, @Res() res:any) {
    let result = await this.mediaService.deleteMedia(+id);
    if (result) {
      ResponseHandler.sendSuccess(FileDeleted, null, res)
    }
  }
}
