import { Injectable } from '@angular/core';
import { Person } from './dtos';

@Injectable({
  providedIn: 'root',
})
export class PersonApiService {

  baseUrl = 'http://localhost:5053/api/person';
  constructor() { }

async getAllPersons(): Promise<Person[] | null> {
  try {
    const response = await fetch(`${this.baseUrl}`);
    if  (!response.ok) {
      console.error('Error fetching persons:', response.statusText);
      return null;
    }
    const data = await response.json();
    console.log('Persons data:', data);
    return data as Person[];
  } catch (error) {
    console.error('Error fetching persons:', error);
    return null;
  }
}


  async getPersonById(id: number): Promise<Person | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if  (!response.ok) {
        console.error('Error fetching person:', response.statusText);
        return null;
      }
      const data = await response.json();
      console.log('Person data:', data);
      return data as Person;
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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fullName })
      });
      if (!response.ok) {
        console.error('Error creating person:', response.statusText);
        return null;
      }
      const data = await response.json();
      console.log('Person created with ID:', data.personId);
      return data.personId;
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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fullName })
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
        method: 'DELETE'
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
