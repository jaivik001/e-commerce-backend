import { MulterModuleOptions } from '@nestjs/platform-express/multer/interfaces/files-upload-module.interface';
import { diskStorage } from 'multer';
import { extname, join, normalize, sep } from 'path';
import * as fs from 'fs'
import { uuid } from 'uuidv4';
import { ResponseHandler } from 'src/common/dtoes/response.dto';
import { DefaultLocalStorageDestination, SubDirAssetsPublic } from 'src/common/utils/constants';
import { FileLog, BodyLog } from 'src/common/utils/string.constants';
import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpError } from 'src/common/utils/enums/errors.enum';

export const multerConfig: MulterModuleOptions = {

    // Check the mimetypes to allow for upload
    fileFilter: (req: any, file: any, cb: any) => {
        console.log(FileLog, file);
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
            cb(null, true);
        } else {
            let error = new HttpException(
                {
                    statusCode: HttpStatus.BAD_REQUEST,
                    errorType: HttpError.BAD_REQUEST,
                    message: `Unsupported file type ${extname(file.originalname)}`,
                    data: null,
                },
                HttpStatus.BAD_REQUEST,
            );
            cb(error, false);
        }
    },

    storage: diskStorage({
        destination: (req: any, file: any, cb: any) => {
            console.log(BodyLog, req.body.data)
            let assets = `${DefaultLocalStorageDestination}/${SubDirAssetsPublic}`
            if (file.fieldname === 'avatar') {
                file.path = `${assets}/${'avatar'}`
                createNestedFolders(file.path)
                cb(null, file.path);
            }
        },

        filename: (req: any, file: any, cb: any): void => {
            console.log('File in module: ', file);
            let fileName = uuid()
            file.filename = [fileName, extname(file.originalname)].join("");
            cb(null, file.filename);

        }
    }),

    //     // limits: {
    //     //     fileSize: 1024 * 1024 * 10, // 10MB limit for each file
    //     // },  

};

let createNestedFolders = (dirPath: string) => {
    const parts = normalize(dirPath).split(sep);

    for (let i = 1; i <= parts.length; i++) {
        const currentPath = join(...parts.slice(0, i));

        if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath);
        }
    }
}