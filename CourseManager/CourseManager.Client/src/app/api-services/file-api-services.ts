import { Injectable } from '@angular/core';
import { FileAsset } from './dtos';

@Injectable({
  providedIn: 'root',
})
export class FileApiService {
  baseUrl = 'http://localhost:5053/api/files';

  constructor() {}

  getDownloadUrl(fileAssetId: number): string {
    return `${this.baseUrl}/${fileAssetId}/download`;
  }

  getInlineUrl(fileAssetId: number): string {
    return `${this.baseUrl}/${fileAssetId}/inline`;
  }

  async getFileById(fileAssetId: number): Promise<FileAsset | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${fileAssetId}`);
      const data = await response.json();

      console.log('File data:', data);

      return data as FileAsset;
    } catch (error) {
      console.error('Error fetching file:', error);
      return null;
    }
  }

  async getCourseFiles(courseId: number): Promise<FileAsset[]> {
    try {
      const response = await fetch(`${this.baseUrl}/course/${courseId}`);

      const data = await response.json();

      console.log('Course files data:', data);
      return data as FileAsset[];
    } catch (error) {
      console.error('Error fetching course files:', error);
      return [];
    }
  }
  async getCourseSectionFiles(courseSectionId: number): Promise<FileAsset[]> {
    try {
      const response = await fetch(`${this.baseUrl}/course-section/${courseSectionId}`);

      const data = await response.json();

      console.log('Course section files data:', data);
      return data as FileAsset[];
    } catch (error) {
      console.error('Error fetching course section files:', error);
      return [];
    }
  }
  async getGroupFiles(groupId: number): Promise<FileAsset[]> {
    try {
      const response = await fetch(`${this.baseUrl}/group/${groupId}`);

      const data = await response.json();

      console.log('Group files data:', data);
      return data as FileAsset[];
    } catch (error) {
      console.error('Error fetching group files:', error);
      return [];
    }
  }
  async getPersonFiles(personId: number): Promise<FileAsset[]> {
    try {
      const response = await fetch(`${this.baseUrl}/person/${personId}`);

      const data = await response.json();

      console.log('Person files data:', data);
      return data as FileAsset[];
    } catch (error) {
      console.error('Error fetching person files:', error);
      return [];
    }
  }
  async deleteFile(fileAssetId: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${fileAssetId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error deleting file: ${response.status}`);
      }

      console.log('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }
  async getFileContent(fileAssetId: number): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${fileAssetId}/content`);

      if (!response.ok) {
        throw new Error(`Error fetching file content: ${response.status}`);
      }

      const data = await response.text();
      console.log('File content:', data);
      return data;
    } catch (error) {
      console.error('Error fetching file content:', error);
      return null;
    }
  }
  async updateFileContent(fileAssetId: number, content: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${fileAssetId}/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error(`Error updating file content: ${response.status}`);
      }

      console.log('File content updated successfully');
    } catch (error) {
      console.error('Error updating file content:', error);
    }
  }
  async downloadFile(fileAssetId: number): Promise<Blob | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${fileAssetId}/download`);

      if (!response.ok) {
        throw new Error(`Error downloading file: ${response.status}`);
      }

      const blob = await response.blob();

      console.log('File downloaded successfully');

      return blob;
    } catch (error) {
      console.error('Error downloading file:', error);
      return null;
    }
  }
  async uploadFile(entityType: string, entityId: number, file: File): Promise<FileAsset | null> {
    try {
      const formData = new FormData();

      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}/upload/${entityType}/${entityId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error uploading file: ${response.status}`);
      }

      const data = await response.json();

      console.log('Uploaded file:', data);

      return data as FileAsset;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  }
  async removeFileFromCourse(courseId: number, fileAssetId: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/course/${courseId}/${fileAssetId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error removing file from course: ${response.status}`);
      }

      console.log('File removed from course successfully');
    } catch (error) {
      console.error('Error removing file from course:', error);
    }
  }

  async removeFileFromCourseSection(sectionId: number, fileAssetId: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/course-section/${sectionId}/${fileAssetId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error removing file from course section: ${response.status}`);
      }

      console.log('File removed from course section successfully');
    } catch (error) {
      console.error('Error removing file from course section:', error);
    }
  }
  async removeFileFromGroup(groupId: number, fileAssetId: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/group/${groupId}/${fileAssetId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error removing file from group: ${response.status}`);
      }

      console.log('File removed from group');
    } catch (error) {
      console.error('Error removing file from group:', error);
    }
  }
  async removeFileFromPerson(personId: number, fileAssetId: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/person/${personId}/${fileAssetId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error removing file from person: ${response.status}`);
      }

      console.log('File removed from person');
    } catch (error) {
      console.error('Error removing file from person:', error);
    }
  }
}
