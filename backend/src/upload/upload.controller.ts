// upload.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('Upload')
@Controller('upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Загрузить изображение' })
  @ApiConsumes('multipart/form-data')
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
      url: this.uploadService.getFileUrl(req, file.filename),
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  @Post('video')
  @UseInterceptors(FileInterceptor('file'))
  uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!file || !this.uploadService.validateVideo(file)) {
      throw new BadRequestException('Недопустимый формат видео');
    }

    return {
      filename: file.filename,
      url: this.uploadService.getFileUrl(req, file.filename),
    };
  }

  @Post('audio')
  @UseInterceptors(FileInterceptor('file'))
  uploadAudio(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!file || !this.uploadService.validateAudio(file)) {
      throw new BadRequestException('Недопустимый формат аудио');
    }

    return {
      filename: file.filename,
      url: this.uploadService.getFileUrl(req, file.filename),
    };
  }
}
