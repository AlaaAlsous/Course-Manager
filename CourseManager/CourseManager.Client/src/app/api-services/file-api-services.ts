import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileAsset } from './dtos';
import { environment } from '../../environments/environment';
import { AuthApiService } from './auth-api-service';

@Injectable({
  providedIn: 'root',
})
export class FileApiService {
  private baseUrl = `${environment.apiUrl}/files`;
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthApiService);

  private appendToken(url: string): string {
    const token = this.authService.getToken();
    if (!token) return url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}access_token=${encodeURIComponent(token)}`;
  }

  getDownloadUrl(fileAssetId: number): string {
    return this.appendToken(`${this.baseUrl}/${fileAssetId}/download`);
  }

  getInlineUrl(fileAssetId: number): string {
    return this.appendToken(`${this.baseUrl}/${fileAssetId}/inline`);
  }

  async getFileById(fileAssetId: number): Promise<FileAsset | null> {
    try {
      const data = await this.http.get<FileAsset>(`${this.baseUrl}/${fileAssetId}`).toPromise();
      return data ?? null;
    } catch (error) {
      console.error('Error fetching file:', error);
      return null;
    }
  }

  async getCourseFiles(courseId: number): Promise<FileAsset[]> {
    try {
      const data = await this.http
        .get<FileAsset[]>(`${this.baseUrl}/course/${courseId}`)
        .toPromise();
      return data ?? [];
    } catch (error) {
      console.error('Error fetching course files:', error);
      return [];
    }
  }

  async getCourseSectionFiles(courseSectionId: number): Promise<FileAsset[]> {
    try {
      const data = await this.http
        .get<FileAsset[]>(`${this.baseUrl}/course-section/${courseSectionId}`)
        .toPromise();
      return data ?? [];
    } catch (error) {
      console.error('Error fetching course section files:', error);
      return [];
    }
  }

  async getGroupFiles(groupId: number): Promise<FileAsset[]> {
    try {
      const data = await this.http.get<FileAsset[]>(`${this.baseUrl}/group/${groupId}`).toPromise();
      return data ?? [];
    } catch (error) {
      console.error('Error fetching group files:', error);
      return [];
    }
  }

  async getPersonFiles(personId: number): Promise<FileAsset[]> {
    try {
      const data = await this.http
        .get<FileAsset[]>(`${this.baseUrl}/person/${personId}`)
        .toPromise();
      return data ?? [];
    } catch (error) {
      console.error('Error fetching person files:', error);
      return [];
    }
  }

  async deleteFile(fileAssetId: number): Promise<void> {
    try {
      await this.http.delete(`${this.baseUrl}/${fileAssetId}`).toPromise();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  async getFileContent(fileAssetId: number): Promise<string | null> {
    try {
      const data = await this.http
        .get(`${this.baseUrl}/${fileAssetId}/content`, { responseType: 'text' })
        .toPromise();
      return data ?? null;
    } catch (error) {
      console.error('Error fetching file content:', error);
      return null;
    }
  }

  async updateFileContent(fileAssetId: number, content: string): Promise<void> {
    try {
      await this.http.put(`${this.baseUrl}/${fileAssetId}/content`, { content }).toPromise();
    } catch (error) {
      console.error('Error updating file content:', error);
    }
  }

  async downloadFile(fileAssetId: number): Promise<Blob | null> {
    try {
      const data = await this.http
        .get(`${this.baseUrl}/${fileAssetId}/download`, { responseType: 'blob' })
        .toPromise();
      return data ?? null;
    } catch (error) {
      console.error('Error downloading file:', error);
      return null;
    }
  }

  async uploadFile(entityType: string, entityId: number, file: File): Promise<FileAsset | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const data = await this.http
        .post<FileAsset>(`${this.baseUrl}/upload/${entityType}/${entityId}`, formData)
        .toPromise();
      return data ?? null;
    } catch (error: any) {
      console.error('Error uploading file:', error);
      throw new Error(error.error?.detail ?? 'File upload failed');
    }
  }

  async removeFileFromCourse(courseId: number, fileAssetId: number): Promise<void> {
    try {
      await this.http.delete(`${this.baseUrl}/course/${courseId}/${fileAssetId}`).toPromise();
    } catch (error) {
      console.error('Error removing file from course:', error);
    }
  }

  async removeFileFromCourseSection(sectionId: number, fileAssetId: number): Promise<void> {
    try {
      await this.http
        .delete(`${this.baseUrl}/course-section/${sectionId}/${fileAssetId}`)
        .toPromise();
    } catch (error) {
      console.error('Error removing file from course section:', error);
    }
  }

  async removeFileFromGroup(groupId: number, fileAssetId: number): Promise<void> {
    try {
      await this.http.delete(`${this.baseUrl}/group/${groupId}/${fileAssetId}`).toPromise();
    } catch (error) {
      console.error('Error removing file from group:', error);
    }
  }

  async removeFileFromPerson(personId: number, fileAssetId: number): Promise<void> {
    try {
      await this.http.delete(`${this.baseUrl}/person/${personId}/${fileAssetId}`).toPromise();
    } catch (error) {
      console.error('Error removing file from person:', error);
    }
  }
}
