import { Injectable } from '@angular/core';
import { Person, Course, CourseSection, Group, PersonRelations } from './dtos';

@Injectable({
  providedIn: 'root',
})
export class RelationsApiService {
  baseUrl = 'http://localhost:5053/api/relations';

  constructor() {}

  async getPeopleInCourse(courseId: number): Promise<Person[] | null> {
    try {
      const response = await fetch(`${this.baseUrl}/course/${courseId}/people`);

      if (!response.ok) {
        console.error('Error fetching course people:', response.statusText);
        return null;
      }

      const data = await response.json();
      return data as Person[];
    } catch (error) {
      console.error('Error fetching course people:', error);
      return null;
    }
  }

  async addPersonToCourse(courseId: number, personId: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/course/${courseId}/people/${personId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        console.error('Error adding person to course:', response.statusText);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error adding person to course:', error);
      return false;
    }
  }

  async removePersonFromCourse(courseId: number, personId: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/course/${courseId}/people/${personId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        console.error('Error removing person from course:', response.statusText);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error removing person from course:', error);
      return false;
    }
  }

  async getPeopleInSection(sectionId: number): Promise<Person[] | null> {
    try {
      const response = await fetch(`${this.baseUrl}/section/${sectionId}/people`);

      if (!response.ok) {
        console.error('Error fetching section people:', response.statusText);
        return null;
      }

      const data = await response.json();
      return data as Person[];
    } catch (error) {
      console.error('Error fetching section people:', error);
      return null;
    }
  }

  async addPersonToSection(sectionId: number, personId: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/section/${sectionId}/people/${personId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        console.error('Error adding person to section:', response.statusText);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error adding person to section:', error);
      return false;
    }
  }

  async removePersonFromSection(sectionId: number, personId: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/section/${sectionId}/people/${personId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        console.error('Error removing person from section:', response.statusText);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error removing person from section:', error);
      return false;
    }
  }

  async getPeopleInGroup(groupId: number): Promise<Person[] | null> {
    try {
      const response = await fetch(`${this.baseUrl}/group/${groupId}/people`);

      if (!response.ok) {
        console.error('Error fetching group people:', response.statusText);
        return null;
      }

      const data = await response.json();
      return data as Person[];
    } catch (error) {
      console.error('Error fetching group people:', error);
      return null;
    }
  }

  async addPersonToGroup(groupId: number, personId: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/group/${groupId}/people/${personId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        console.error('Error adding person to group:', response.statusText);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error adding person to group:', error);
      return false;
    }
  }

  async removePersonFromGroup(groupId: number, personId: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/group/${groupId}/people/${personId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        console.error('Error removing person from group:', response.statusText);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error removing person from group:', error);
      return false;
    }
  }

  async getPersonRelations(personId: number): Promise<PersonRelations | null> {
    try {
      const response = await fetch(`${this.baseUrl}/person/${personId}`);

      if (!response.ok) {
        console.error('Error fetching person relations:', response.statusText);
        return null;
      }

      const data = await response.json();

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
