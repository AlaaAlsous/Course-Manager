import { Injectable } from '@angular/core';
import { Group } from './dtos';

@Injectable({
  providedIn: 'root',
})
export class GroupApiService {

  baseUrl = 'http://localhost:5053/api/group';
  relationsBaseUrl = 'http://localhost:5053/api/relations';
  constructor() { }


  async getAllGroups(): Promise<Group[]> {
    try {
      const response = await fetch(`${this.baseUrl}`);
      const data = await response.json();
      return data as Group[];
    } catch (error) {
      console.error('Error fetching groups:', error);
      return [];
    }
  }

  async getGroupById(id: number): Promise<Group | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      const data = await response.json();
      return data as Group;
    } catch (error) {
      console.error('Error fetching group:', error);
      return null;
    }
  }

  async getGroupByCourseSectionId(courseSectionId: number): Promise<Group | null> {
    try {
      const response = await fetch(`${this.baseUrl}/course-section/${courseSectionId}`);
      const data = await response.json();
      return data as Group;
    } catch (error) {
      console.error('Error fetching group:', error);
      return null;
    }
  }
  
  async createGroup(name: string, courseSectionId: number): Promise<number | null> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, courseSectionId })
      });
      const data = await response.json();
      return data.groupId;
    } catch (error) {
      console.error('Error creating group:', error);
      return null;
    }
  }

  async updateGroup(id: number, name: string, courseSectionId: number): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, courseSectionId })
      });
    } catch (error) {
      console.error('Error updating group:', error);  
    }
  }

  async deleteGroup(id: number): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  }

  async getAllPeople(groupId: number): Promise<number[]> {
    try {
      const response = await fetch(`${this.relationsBaseUrl}/group/${groupId}/people`);
      const data = await response.json();
      return (data as { personId: number }[]).map(p => p.personId);
    } catch (error) {
      console.error('Error fetching people in group:', error);
      return [];
    }
  }

  async addPerson(groupId: number, personId: number): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.relationsBaseUrl}/group/${groupId}/people/${personId}`,
        { method: 'POST' }
      );
      return response.ok;
    } catch (error) {
      console.error('Error adding person to group:', error);
      return false;
    }
  }

  async deletePerson(groupId: number, personId: number): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.relationsBaseUrl}/group/${groupId}/people/${personId}`,
        { method: 'DELETE' }
      );
      return response.ok;
    } catch (error) {
      console.error('Error removing person from group:', error);
      return false;
    }
  }
}
