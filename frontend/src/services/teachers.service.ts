import { HttpClient } from './httpClient';

export interface TeacherDto {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phone?: string;
  role?: string;
  photoUrl?: string;
  audioUrl?: string;
}

export interface CreateTeacherDto {
  firstName: string;
  lastName: string;
  middleName?: string;
  phone?: string;
  role?: string;
  photoUrl?: string;
  audioUrl?: string;
}

export interface UpdateTeacherDto {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  phone?: string;
  role?: string;
  photoUrl?: string;
  audioUrl?: string;
}

interface UploadResponse {
  filename: string;
}

const getPublicUrl = (filename: string) =>
  `http://81.177.216.68:3000/api/uploads/${filename}`;

export class TeachersFrontendService {
  constructor(private readonly http: HttpClient) {}

  create<T = unknown>(payload: CreateTeacherDto) {
    return this.http.post<T>('/teachers', payload);
  }

  findAll<T = TeacherDto[]>() {
    return this.http.get<T>('/teachers', { authenticate: false });
  }

  findOne<T = TeacherDto>(teacherId: string) {
    return this.http.get<T>(`/teachers/${teacherId}`, {
      authenticate: false,
    });
  }

  update<T = unknown>(teacherId: string, payload: UpdateTeacherDto) {
    return this.http.patch<T>(`/teachers/${teacherId}`, payload);
  }

  remove<T = unknown>(teacherId: string) {
    return this.http.delete<T>(`/teachers/${teacherId}`);
  }

  // ================== UPLOAD IMAGE ==================
  async uploadTempImage(file: File): Promise<{ url: string }> {
    const fd = new FormData();
    fd.append('file', file);

    const res = await this.http.post<UploadResponse>(
      '/upload/image',
      fd,
      { authenticate: true },
    );

    if (!res?.filename) {
      throw new Error('Upload image failed: filename not returned');
    }

    return {
      url: getPublicUrl(res.filename),
    };
  }

  // ================== UPLOAD AUDIO ==================
  async uploadTempAudio(file: File): Promise<{ url: string }> {
    const fd = new FormData();
    fd.append('file', file);

    const res = await this.http.post<UploadResponse>(
      '/upload/audio',
      fd,
      { authenticate: true },
    );

    if (!res?.filename) {
      throw new Error('Upload audio failed: filename not returned');
    }

    return {
      url: getPublicUrl(res.filename),
    };
  }
}
