import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LocalStorageService {

    async deleteFile(filePath:string, deleteOptions?:any) {
        try {
            fs.unlinkSync(filePath)
            console.log(`| ${filePath} deleted`);
            return true
        } catch (error) {
            throw error
        }
    }

    async readFile(filePath:string) {
        try {
            let readStream = fs.readFileSync(filePath)
            console.log(`| ${filePath} read file`);
            return readStream
        } catch (error) {
            throw error
        }
    }

    async readStreamFile(filePath:string) {
      try {
          let readStream = fs.createReadStream(filePath) 
          return readStream
      } catch (error) {
          throw error
      }
    }

    async writeFile(filePath:string) {
        try {
            let writeStream = fs.createWriteStream(filePath);
            console.log(`| ${filePath} write file`);
            return writeStream
        } catch (error) {
            throw error
        }
    }

    async writeFileSync(filePath:string, data:any) {
      try {
          let writeStream = fs.writeFileSync(filePath, data);
          console.log(`| ${filePath} write file`);
          return writeStream
      } catch (error) {
          throw error
      }
  }
 
    async deleteFilesFromFolder(prefix:string){
      try{
        fs.rmSync(prefix, { recursive: true });  
        console.log('| All files in the folder have been deleted.');
        return true
      }catch(err){
        throw err   
      }
    }

    async deleteMatchFilesFromFolder(prefix:string){
        try{
            let pathArr = prefix.split('/')
            let filenamePattern:any = pathArr.pop() 
            let path = pathArr.slice(0, pathArr.length).join('/')
            let files = await this.listFilesByPrefix(path)
            const matchingFiles = files.filter(file => file.startsWith(filenamePattern));
            matchingFiles.forEach(async file => {
                await this.deleteFile(`${path}/${file}`)
            });
            console.log('| All match files in the folder have been deleted.');
            return true
        }catch(err){
          throw err   
        }
      }

    async listFilesByPrefix(prefix: string) {
        try {
            const files = fs.readdirSync(prefix);
            return files    
        } catch (err) {
            throw err
        }
    }

    async checkFileExist(filePath: string) {
        try {
            const file = fs.existsSync(filePath);
            return file    
        } catch (err) {
            throw err
        }
    }

    async moveFile(sourcePath:string, destinationPath:string) {
        try {
            fs.rename(sourcePath, destinationPath, (err) => {
                if (err) {
                    throw err
                } else {
                    console.log('File moved successfully!');
                }
            })
        } catch (err) {
            console.error('Error moving file:', err);
            throw err
        }
    }

    async removeEmptyNestedFolders(dirPath:string) {
        try {
          const contents = await fs.promises.readdir(dirPath);
    
          if (contents.length === 0) {
            await fs.promises.rmdir(dirPath);
            console.log(`Removed empty directory: ${dirPath}`);
            return;
          }
    
          for (const content of contents) {
            const contentPath = path.join(dirPath, content);
            const stat = await fs.promises.stat(contentPath);
    
            if (stat.isDirectory()) {
              await this.removeEmptyNestedFolders(contentPath);
            }
          }
    
          const updatedContents = await fs.promises.readdir(dirPath);
          if (updatedContents.length === 0) {
            await fs.promises.rmdir(dirPath);
          }
        } catch (error) {
          console.error(`Error removing directory ${dirPath}:`, error);
        }
      }

}
