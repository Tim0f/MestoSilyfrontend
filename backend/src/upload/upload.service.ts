// upload.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  /**
   * BACKWARD COMPATIBLE
   * Можно вызывать:
   *  - getFileUrl(filename)
   *  - getFileUrl(req, filename)
   */
  getFileUrl(
    reqOrFilename:
      | string
      | { protocol?: string; get?(name: string): string | undefined },
    maybeFilename?: string,
  ): string {
    let filename: string;
    let baseUrl: string;

    // 🟢 Старый вариант: getFileUrl(filename)
    if (typeof reqOrFilename === 'string') {
      filename = reqOrFilename;
      baseUrl =
        process.env.PUBLIC_BASE_URL ||
        process.env.APP_URL ||
        'http://localhost:3000';
    } else {
      // 🟢 Новый вариант: getFileUrl(req, filename)
      if (!maybeFilename) {
        throw new Error('Filename is required');
      }

      filename = maybeFilename;
      const protocol = reqOrFilename.protocol || 'http';
      const host = reqOrFilename.get?.('host');

      if (!host) {
        throw new Error('Host header is missing');
      }

      baseUrl = `${protocol}://${host}`;
    }

    return `${baseUrl}/api/uploads/${filename}`;
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
