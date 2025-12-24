// upload.service.ts
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class UploadService {
  getFileUrl(filename: string): string {
    return `/api/uploads/${filename}`;
  }

  validateImage(file: Express.Multer.File): boolean {
    return [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'image/svg',
    ].includes(file.mimetype);
  }

  validateVideo(file: Express.Multer.File): boolean {
    return ['video/mp4', 'video/webm', 'video/avi'].includes(file.mimetype);
  }

  validateAudio(file: Express.Multer.File): boolean {
    return [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'audio/webm',
    ].includes(file.mimetype);
  }
}

