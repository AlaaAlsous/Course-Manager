import { Injectable } from '@angular/core';
import { Group } from './dtos';

interface PersonDto {
  id: number;
  fullName: string;
}

@Injectable({
  providedIn: 'root',
})
export class GroupApiService {
  baseUrl = 'http://localhost:5053/api/group';
  relationsBaseUrl = 'http://localhost:5053/api/relations';
  constructor() {}

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
      const response = await fetch(`${this.baseUrl}`);
      if (!response.ok) {
        console.error('Error fetching groups:', response.statusText);
        return [];
      }
      const data = await response.json();
      return (data as any[]).map((group) => this.mapGroup(group));
    } catch (error) {
      console.error('Error fetching groups:', error);
      return [];
    }
  }

  async getGroupById(id: number): Promise<Group | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        console.error('Error fetching group:', response.statusText);
        return null;
      }
      const data = await response.json();
      return this.mapGroup(data);
    } catch (error) {
      console.error('Error fetching group:', error);
      return null;
    }
  }

  async getGroupByCourseSectionId(courseSectionId: number): Promise<Group[]> {
    try {
      const response = await fetch(`${this.baseUrl}/course-section/${courseSectionId}`);
      if (!response.ok) {
        console.error('Error fetching group by course section ID:', response.statusText);
        return [];
      }
      const data = await response.json();
      return (data as any[]).map((group) => this.mapGroup(group));
    } catch (error) {
      console.error('Error fetching group:', error);
      return [];
    }
  }

  async createGroup(name: string, courseSectionId: number): Promise<number | null> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, courseSectionId }),
      });
      if (!response.ok) {
        console.error('Error creating group:', response.statusText);
        return null;
      }
      const data = await response.json();
      console.log('Group created with ID:', data.groupId);
      return data.groupId;
    } catch (error) {
      console.error('Error creating group:', error);
      return null;
    }
  }

  async updateGroup(id: number, name: string, courseSectionId: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, courseSectionId }),
      });
      if (!response.ok) {
        console.error('Error updating group:', response.statusText);
        return false;
      }
      console.log('Group updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating group:', error);
      return false;
    }
  }

  async deleteGroup(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        console.error('Error deleting group:', response.statusText);
        return false;
      }
      console.log('Group deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting group:', error);
      return false;
    }
  }

  async getAllPeople(groupId: number): Promise<PersonDto[]> {
    try {
      const response = await fetch(`${this.relationsBaseUrl}/group/${groupId}/people`);
      if (!response.ok) {
        console.error('Error fetching people in group:', response.statusText);
        return [];
      }
      const data = await response.json();
      return (data as any[]).map((person) => this.mapPerson(person));
    } catch (error) {
      console.error('Error fetching people in group:', error);
      return [];
    }
  }

  async addPerson(groupId: number, personId: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.relationsBaseUrl}/group/${groupId}/people/${personId}`, {
        method: 'POST',
      });
      if (!response.ok) {
        console.error('Error adding person to group:', response.statusText);
        return false;
      }
      console.log('Person added to group successfully');
      return true;
    } catch (error) {
      console.error('Error adding person to group:', error);
      return false;
    }
  }

  async deletePerson(groupId: number, personId: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.relationsBaseUrl}/group/${groupId}/people/${personId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        console.error('Error removing person from group:', response.statusText);
        return false;
      }
      console.log('Person removed from group successfully');
      return true;
    } catch (error) {
      console.error('Error removing person from group:', error);
      return false;
    }
  }
}
