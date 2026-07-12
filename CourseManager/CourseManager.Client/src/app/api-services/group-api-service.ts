import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Group } from './dtos';
import { environment } from '../../environments/environment';

interface PersonDto {
  id: number;
  fullName: string;
}

@Injectable({
  providedIn: 'root',
})
export class GroupApiService {
  private baseUrl = `${environment.apiUrl}/group`;
  private relationsBaseUrl = `${environment.apiUrl}/relations`;
  private readonly http = inject(HttpClient);

  private mapGroup(data: any): Group {
    return {
      id: data.id ?? data.groupId,
      name: data.name,
      courseSectionId: data.courseSectionId,
    };
  }

  private mapPerson(data: any): PersonDto {
    return {
      id: data.id ?? data.personId,
      fullName: data.fullName,
    };
  }

  async getAllGroups(): Promise<Group[]> {
    try {
      const data = await this.http.get<any[]>(`${this.baseUrl}`).toPromise();
      return (data ?? []).map((group) => this.mapGroup(group));
    } catch (error) {
      console.error('Error fetching groups:', error);
      return [];
    }
  }

  async getGroupById(id: number): Promise<Group | null> {
    try {
      const data = await this.http.get<any>(`${this.baseUrl}/${id}`).toPromise();
      return this.mapGroup(data);
    } catch (error) {
      console.error('Error fetching group:', error);
      return null;
    }
  }

  async getGroupByCourseSectionId(courseSectionId: number): Promise<Group[]> {
    try {
      const data = await this.http
        .get<any[]>(`${this.baseUrl}/course-section/${courseSectionId}`)
        .toPromise();
      return (data ?? []).map((group) => this.mapGroup(group));
    } catch (error) {
      console.error('Error fetching group:', error);
      return [];
    }
  }

  async createGroup(name: string, courseSectionId: number): Promise<number | null> {
    try {
      const data = await this.http
        .post<any>(`${this.baseUrl}`, { name, courseSectionId })
        .toPromise();
      return data.groupId;
    } catch (error) {
      console.error('Error creating group:', error);
      return null;
    }
  }

  async updateGroup(id: number, name: string): Promise<boolean> {
    try {
      await this.http.put(`${this.baseUrl}/${id}`, { name }).toPromise();
      return true;
    } catch (error) {
      console.error('Error updating group:', error);
      return false;
    }
  }

  async deleteGroup(id: number): Promise<boolean> {
    try {
      await this.http.delete(`${this.baseUrl}/${id}`).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting group:', error);
      return false;
    }
  }

  async getAllPeople(groupId: number): Promise<PersonDto[]> {
    try {
      const data = await this.http
        .get<any[]>(`${this.relationsBaseUrl}/group/${groupId}/people`)
        .toPromise();
      return (data ?? []).map((person) => this.mapPerson(person));
    } catch (error) {
      console.error('Error fetching people in group:', error);
      return [];
    }
  }

  async addPerson(groupId: number, personId: number): Promise<boolean> {
    try {
      await this.http
        .post(`${this.relationsBaseUrl}/group/${groupId}/people/${personId}`, null)
        .toPromise();
      return true;
    } catch (error) {
      console.error('Error adding person to group:', error);
      return false;
    }
  }

  async deletePerson(groupId: number, personId: number): Promise<boolean> {
    try {
      await this.http
        .delete(`${this.relationsBaseUrl}/group/${groupId}/people/${personId}`)
        .toPromise();
      return true;
    } catch (error) {
      console.error('Error removing person from group:', error);
      return false;
    }
  }
}
