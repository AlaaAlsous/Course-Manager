import { Injectable } from '@angular/core';
import { Course } from './dtos';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CourseApiService {
  private baseUrl = `${environment.apiUrl}/course`;

  constructor() {}

  private mapCourse(data: any): Course {
    return {
      id: data.id ?? data.courseId,
      name: data.name,
      description: data.description ?? null,
      createdAt: data.createdAt,
    };
  }

  async getAllCourses(): Promise<Course[]> {
    try {
      const response = await fetch(`${this.baseUrl}`);
      if (!response.ok) {
        console.error('Error fetching courses:', response.statusText);
        return [];
      }
      const data = await response.json();
      console.log('Courses data:', data);
      return (data as any[]).map((course) => this.mapCourse(course));
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
  }

  async getCourseById(id: number): Promise<Course | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        console.error('Error fetching course:', response.statusText);
        return null;
      }
      const data = await response.json();
      console.log('Course data:', data);
      return this.mapCourse(data);
    } catch (error) {
      console.error('Error fetching course:', error);
      return null;
    }
  }

  async createCourse(name: string, description: string | null): Promise<number | null> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });
      if (!response.ok) {
        console.error('Error creating course:', response.statusText);
        return null;
      }
      const data = await response.json();
      return data.courseId;
    } catch (error) {
      console.error('Error creating course:', error);
      return null;
    }
  }

  async updateCourse(id: number, name: string, description: string | null): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });
      if (!response.ok) {
        console.error('Error updating course:', response.statusText);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error updating course:', error);
      return false;
    }
  }

  async deleteCourse(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        console.error('Error deleting course:', response.statusText);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error deleting course:', error);
      return false;
    }
  }
}
