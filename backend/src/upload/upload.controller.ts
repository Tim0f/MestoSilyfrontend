// upload.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Get,
  Param,
  Res,
  Req,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Upload')
@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // ================= UPLOAD IMAGE =================
  @Post('upload/image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Загрузить изображение' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new BadRequestException('Файл не загружен');
    }

    if (!this.uploadService.validateImage(file)) {
      throw new BadRequestException('Недопустимый формат изображения');
    }

    return {
      filename: file.filename,
      url: this.uploadService.getPublicFileUrl(req, file.filename),
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  // ================= UPLOAD AUDIO =================
  @Post('upload/audio')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadAudio(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new BadRequestException('Файл не загружен');
    }

    if (!this.uploadService.validateAudio(file)) {
      throw new BadRequestException('Недопустимый формат аудио');
    }

    return {
      filename: file.filename,
      url: this.uploadService.getPublicFileUrl(req, file.filename),
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  // ================= GET FILE =================
  @Get('uploads/:filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    if (!this.uploadService.fileExists(filename)) {
      throw new NotFoundException('Файл не найден');
    }

    return res.sendFile(this.uploadService.getFilePath(filename));
  }
}
