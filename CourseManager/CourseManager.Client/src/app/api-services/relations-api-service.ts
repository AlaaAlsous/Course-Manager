import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Person, PersonRelations } from './dtos';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RelationsApiService {
  private baseUrl = `${environment.apiUrl}/relations`;
  private readonly http = inject(HttpClient);

  async getPeopleInCourse(courseId: number): Promise<Person[] | null> {
    try {
      const data = await this.http
        .get<Person[]>(`${this.baseUrl}/course/${courseId}/people`)
        .toPromise();
      return data ?? [];
    } catch (error) {
      console.error('Error fetching course people:', error);
      return null;
    }
  }

  async addPersonToCourse(courseId: number, personId: number): Promise<boolean> {
    try {
      await this.http
        .post(`${this.baseUrl}/course/${courseId}/people/${personId}`, null)
        .toPromise();
      return true;
    } catch (error) {
      console.error('Error adding person to course:', error);
      return false;
    }
  }

  async removePersonFromCourse(courseId: number, personId: number): Promise<boolean> {
    try {
      await this.http.delete(`${this.baseUrl}/course/${courseId}/people/${personId}`).toPromise();
      return true;
    } catch (error) {
      console.error('Error removing person from course:', error);
      return false;
    }
  }

  async getPeopleInSection(sectionId: number): Promise<Person[] | null> {
    try {
      const data = await this.http
        .get<Person[]>(`${this.baseUrl}/section/${sectionId}/people`)
        .toPromise();
      return data ?? [];
    } catch (error) {
      console.error('Error fetching section people:', error);
      return null;
    }
  }

  async addPersonToSection(sectionId: number, personId: number): Promise<boolean> {
    try {
      await this.http
        .post(`${this.baseUrl}/section/${sectionId}/people/${personId}`, null)
        .toPromise();
      return true;
    } catch (error) {
      console.error('Error adding person to section:', error);
      return false;
    }
  }

  async removePersonFromSection(sectionId: number, personId: number): Promise<boolean> {
    try {
      await this.http.delete(`${this.baseUrl}/section/${sectionId}/people/${personId}`).toPromise();
      return true;
    } catch (error) {
      console.error('Error removing person from section:', error);
      return false;
    }
  }

  async getPeopleInGroup(groupId: number): Promise<Person[] | null> {
    try {
      const data = await this.http
        .get<Person[]>(`${this.baseUrl}/group/${groupId}/people`)
        .toPromise();
      return data ?? [];
    } catch (error) {
      console.error('Error fetching group people:', error);
      return null;
    }
  }

  async addPersonToGroup(groupId: number, personId: number): Promise<boolean> {
    try {
      await this.http.post(`${this.baseUrl}/group/${groupId}/people/${personId}`, null).toPromise();
      return true;
    } catch (error) {
      console.error('Error adding person to group:', error);
      return false;
    }
  }

  async removePersonFromGroup(groupId: number, personId: number): Promise<boolean> {
    try {
      await this.http.delete(`${this.baseUrl}/group/${groupId}/people/${personId}`).toPromise();
      return true;
    } catch (error) {
      console.error('Error removing person from group:', error);
      return false;
    }
  }

  async getPersonRelations(personId: number): Promise<PersonRelations | null> {
    try {
      const data = await this.http.get<any>(`${this.baseUrl}/person/${personId}`).toPromise();

      return {
        courses: data.courses ?? [],
        sections: data.sections ?? [],
        groups: data.groups ?? [],
      };
    } catch (error) {
      console.error('Error fetching person relations:', error);
      return null;
    }
  }
}
