import { Injectable } from '@nestjs/common';
import { Media } from 'src/shared/tables/postgres-tables/media.entity';
import { InjectModel } from '@nestjs/sequelize';
import { extname } from 'path';
import { ResponseHandler } from 'src/common/dtoes/response.dto';
import { FileNotFound, RequireMediaId, SaveMediaFile } from 'src/common/utils/string.constants';
import { HelperService } from 'src/common/helper/helper.service';
import { Transaction } from 'sequelize';
import { LocalStorageService } from './local/local-storage.service';

@Injectable()
export class MediaService {
    constructor(
        @InjectModel(Media) private mediaModel: typeof Media,
        private readonly localStorageService: LocalStorageService,
        private readonly helperService: HelperService,
    ) { }

    async saveMedia(file: any, transaction?: Transaction): Promise<any> {
        console.log(SaveMediaFile, file);

        file.extension = extname(file.originalname)

        let media = await this.mediaModel.create({
            originalName: file.originalname,
            fileName: file.filename,
            destination: file.destination,
            extension: file.extension,
            mimeType: file.mimetype,
            path: file.path,
            size: file.size,
            height: file.height,
            width: file.width,
            ratio: file.ratio,
            duration: file.duration,
            thumbnailPath: file?.thumbnailPath
        }, { transaction: transaction })
        return media.dataValues
    }

    async deleteMedia(id: number, transaction?: Transaction): Promise<any> {
        let result: any
        if (!this.helperService.isNotEmpty(id)) {
            return ResponseHandler.sendBadRequest(RequireMediaId)
        }
        let media = await this.mediaModel.findOne({ where: { id: id } })
        if (!media) {
            return ResponseHandler.sendNotFound(FileNotFound)
        }
        result = await this.localStorageService.deleteFile(media.path)
        if (result) {
            await media.destroy({ force: true, transaction: transaction })
            return true
        }
    }
}
