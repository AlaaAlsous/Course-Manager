import { Injectable } from '@angular/core';
import { Course } from './dtos';

@Injectable({
  providedIn: 'root',
})
export class CourseApiService {
  baseUrl = 'http://localhost:5053/api/course';

  constructor() {}

  async getAllCourses(): Promise<Course[] | null> {
    try {
      const response = await fetch(`${this.baseUrl}`);
      if  (!response.ok) {
        console.error('Error fetching courses:', response.statusText);
        return null;
      }
      const data = await response.json();
      console.log('Courses data:', data);
      return data as Course[];
    } catch (error) {
      console.error('Error fetching courses:', error);
      return null;  
    }
  }

  async getCourseById(id: number): Promise<Course | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if  (!response.ok) {
        console.error('Error fetching course:', response.statusText);
        return null;
      }
      const data = await response.json();
      console.log('Course data:', data);
      return data as Course;
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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description })
      });
      if (!response.ok) {
        console.error('Error creating course:', response.statusText);
        return null;
      }
      const data = await response.json();
      return data.courseId;
    }
    catch (error) {
      console.error('Error creating course:', error);
      return null;
    }
  }

  async updateCourse(id: number, name: string, description: string | null): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description })
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
        method: 'DELETE'
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
