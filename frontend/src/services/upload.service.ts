import { HttpClient } from './httpClient';
import { ensureFormData, type UploadInput } from './fileUpload';

type UploadResponse = {
  filename?: string;
  url?: string;
};

export class UploadFrontendService {
  constructor(private readonly http: HttpClient) {}

  private extractFilename(res: UploadResponse): string {
    const value = res.filename ?? res.url;
    if (!value) {
      throw new Error('Upload: filename not returned');
    }

    // если пришло /api/uploads/abc.jpg → abc.jpg
    return value.split('/').pop()!;
  }

async image(file: UploadInput): Promise<{ filename: string; url: string }> {
  const res = await this.http.post<UploadResponse>(
    '/upload/image',
    ensureFormData(file),
  );

  return {
    filename: this.extractFilename(res),
    url: res.url!, // сохраняем URL из ответа
  };
}

  async audio(file: UploadInput): Promise<{ filename: string }> {
    const res = await this.http.post<UploadResponse>(
      '/upload/audio',
      ensureFormData(file),
    );

    return {
      filename: this.extractFilename(res),
    };
  }
}
