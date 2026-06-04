import { Injectable } from '@angular/core';
import { Person } from './dtos';

@Injectable({
  providedIn: 'root',
})
export class PersonApiService {
  baseUrl = 'http://localhost:5053/api/person';
  constructor() {}

  private mapPerson(data: any): Person {
    return {
      id: data.id ?? data.personId,
      fullName: data.fullName,
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
      console.log('Persons data:', data);
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
      console.log('Person data:', data);
      return this.mapPerson(data);
    } catch (error) {
      console.error('Error fetching person:', error);
      return null;
    }
  }

  async createPerson(fullName: string): Promise<number | null> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName }),
      });
      if (!response.ok) {
        console.error('Error creating person:', response.statusText);
        return null;
      }
      const data = await response.json();
      const personId = data.id ?? data.personId;
      console.log('Person created with ID:', personId);
      return personId;
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
      console.log('Person updated successfully');
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
      console.log('Person deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting person:', error);
      return false;
    }
  }
}
