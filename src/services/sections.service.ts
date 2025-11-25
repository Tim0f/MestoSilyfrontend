import { HttpClient } from './httpClient';
import { ensureFormData, type UploadInput } from './fileUpload';

export interface CreateSectionDto {
  name: string;
  description: string;
  imageUrl?: string;
  iconUrl?: string;
  ageMin: number;
  ageMax: number;
  maxParticipants: number;
  isActive: boolean;
  galleryDriveUrl: string;
}

export interface UpdateSectionDto {
  name?: string;
  description?: string;
  imageUrl?: string;
  iconUrl?: string;
  ageMin?: number;
  ageMax?: number;
  maxParticipants?: number;
  isActive?: boolean;
  galleryDriveUrl?: string;
}

export interface EnrollDto {
  lessonId?: string;
}

export class SectionsFrontendService {
  constructor(private readonly http: HttpClient) {}

  create<T = unknown>(payload: CreateSectionDto) {
    return this.http.post<T>('/sections', payload);
  }

  findAll<T = unknown>() {
    return this.http.get<T>('/sections', { authenticate: false });
  }

  findOne<T = unknown>(sectionId: string) {
    return this.http.get<T>(`/sections/${sectionId}`, { authenticate: false });
  }

  update<T = unknown>(sectionId: string, payload: UpdateSectionDto) {
    return this.http.patch<T>(`/sections/${sectionId}`, payload);
  }

  remove<T = unknown>(sectionId: string) {
    return this.http.delete<T>(`/sections/${sectionId}`);
  }

  enroll<T = unknown>(payload: { sectionId: string; lessonId?: string }) {
    // backend enrolls user based on token, so we send sectionId + optional lessonId
    return this.http.post<T>('/enrollments', payload);
  }

  // Section images management (backend: addSectionImage, getSectionImages, updateSectionImagePosition, deleteSectionImage)
  addImage<T = unknown>(sectionId: string, imageUrl: string, position: number) {
    return this.http.post<T>(`/sections/${sectionId}/images`, { imageUrl, position });
  }

  getImages<T = unknown>(sectionId: string) {
    return this.http.get<T>(`/sections/${sectionId}/images`);
  }

  updateImagePosition<T = unknown>(imageId: string, position: number) {
    return this.http.patch<T>(`/sections/images/${imageId}`, { position });
  }

  deleteImage<T = unknown>(imageId: string) {
    return this.http.delete<T>(`/sections/images/${imageId}`);
  }

  // If you want an endpoint to upload file and then pass imageUrl — use UploadFrontendService.image
}
