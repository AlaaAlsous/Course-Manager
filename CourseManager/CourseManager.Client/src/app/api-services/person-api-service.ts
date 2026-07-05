import { Injectable } from '@angular/core';
import { Course, CourseSection, Group, Person, PersonOverview, PersonOverviewFile } from './dtos';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PersonApiService {
  private baseUrl = `${environment.apiUrl}/person`;
  private relationsBaseUrl = `${environment.apiUrl}/relations`;
  constructor() {}

  private mapPerson(data: any): Person {
    return {
      id: data.id ?? data.personId,
      fullName: data.fullName,
    };
  }

  private mapCourse(data: any): Course {
    return {
      id: data.id ?? data.courseId,
      name: data.name,
      description: data.description ?? null,
      createdAt: data.createdAt,
    };
  }

  private mapCourseSection(data: any): CourseSection {
    return {
      id: data.id ?? data.courseSectionId,
      courseId: data.courseId,
      name: data.name,
      description: data.description ?? null,
      createdAt: data.createdAt,
      startDate: data.startDate ?? null,
      endDate: data.endDate ?? null,
    };
  }

  private mapGroup(data: any): Group {
    return {
      id: data.id ?? data.groupId,
      name: data.name,
      courseSectionId: data.courseSectionId,
    };
  }

  private mapFile(data: any): PersonOverviewFile {
    return {
      fileAssetId: data.fileAssetId,
      fileName: data.fileName,
      localPath: data.localPath ?? null,
      cloudPath: data.cloudPath ?? null,
      storageProvider: data.storageProvider,
      fileType: data.fileType,
      fileSize: data.fileSize,
      uploadedAt: data.uploadedAt,
      sourceType: data.sourceType,
      sourceId: data.sourceId,
      sourceName: data.sourceName,
    };
  }

  async getAllPersons(): Promise<Person[]> {
    try {
      const response = await fetch(`${this.baseUrl}`);
      if (!response.ok) {
        console.error('Error fetching persons:', response.statusText);
        return [];
      }
      const data = await response.json();
      return (data as any[]).map((person) => this.mapPerson(person));
    } catch (error) {
      console.error('Error fetching persons:', error);
      return [];
    }
  }

  async getPersonById(id: number): Promise<Person | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        console.error('Error fetching person:', response.statusText);
        return null;
      }
      const data = await response.json();
      return this.mapPerson(data);
    } catch (error) {
      console.error('Error fetching person:', error);
      return null;
    }
  }

  async getPersonOverview(id: number): Promise<PersonOverview | null> {
    try {
      const response = await fetch(`${this.relationsBaseUrl}/person/${id}/overview`);
      if (!response.ok) {
        console.error('Error fetching person overview:', response.statusText);
        return null;
      }

      const data = await response.json();
      return {
        person: this.mapPerson(data.person),
        courses: (data.courses as any[]).map((course) => this.mapCourse(course)),
        sections: (data.sections as any[]).map((section) => this.mapCourseSection(section)),
        groups: (data.groups as any[]).map((group) => this.mapGroup(group)),
        files: (data.files as any[]).map((file) => this.mapFile(file)),
      };
    } catch (error) {
      console.error('Error fetching person overview:', error);
      return null;
    }
  }

  async createPerson(fullName: string): Promise<{ id: number; alreadyExists: boolean } | null> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName }),
      });
      if (response.status === 409) {
        const data = await response.json();
        return { id: data.id ?? data.personId, alreadyExists: true };
      }
      if (!response.ok) {
        console.error('Error creating person:', response.statusText);
        return null;
      }
      const data = await response.json();
      return { id: data.id ?? data.personId, alreadyExists: false };
    } catch (error) {
      console.error('Error creating person:', error);
      return null;
    }
  }

  async updatePerson(id: number, fullName: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName }),
      });
      if (!response.ok) {
        console.error('Error updating person:', response.statusText);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error updating person:', error);
      return false;
    }
  }

  async deletePerson(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        console.error('Error deleting person:', response.statusText);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error deleting person:', error);
      return false;
    }
  }
}
