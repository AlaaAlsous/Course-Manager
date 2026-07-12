import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course, CourseSection, Group, Person, PersonOverview, PersonOverviewFile } from './dtos';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PersonApiService {
  private baseUrl = `${environment.apiUrl}/person`;
  private relationsBaseUrl = `${environment.apiUrl}/relations`;
  private readonly http = inject(HttpClient);

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
      const data = await this.http.get<any[]>(`${this.baseUrl}`).toPromise();
      return (data ?? []).map((person) => this.mapPerson(person));
    } catch (error) {
      console.error('Error fetching persons:', error);
      return [];
    }
  }

  async getPersonById(id: number): Promise<Person | null> {
    try {
      const data = await this.http.get<any>(`${this.baseUrl}/${id}`).toPromise();
      return this.mapPerson(data);
    } catch (error) {
      console.error('Error fetching person:', error);
      return null;
    }
  }

  async getPersonOverview(id: number): Promise<PersonOverview | null> {
    try {
      const data = await this.http
        .get<any>(`${this.relationsBaseUrl}/person/${id}/overview`)
        .toPromise();

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
      const data = await this.http.post<any>(`${this.baseUrl}`, { fullName }).toPromise();
      return { id: data.id ?? data.personId, alreadyExists: false };
    } catch (error: any) {
      if (error.status === 409) {
        return { id: error.error?.id ?? error.error?.personId, alreadyExists: true };
      }
      console.error('Error creating person:', error);
      return null;
    }
  }

  async updatePerson(id: number, fullName: string): Promise<boolean> {
    try {
      await this.http.put(`${this.baseUrl}/${id}`, { fullName }).toPromise();
      return true;
    } catch (error) {
      console.error('Error updating person:', error);
      return false;
    }
  }

  async deletePerson(id: number): Promise<boolean> {
    try {
      await this.http.delete(`${this.baseUrl}/${id}`).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting person:', error);
      return false;
    }
  }
}
