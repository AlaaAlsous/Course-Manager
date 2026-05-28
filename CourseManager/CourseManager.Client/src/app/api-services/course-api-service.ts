import { Injectable } from '@angular/core';
import { Course } from './dtos';

@Injectable({
  providedIn: 'root',
})
export class CourseApiService {
  baseUrl = 'http://localhost:5053/api/course';

  constructor() {}

  async getAllCourses(): Promise<Course[]> {
    try {
      const response = await fetch(`${this.baseUrl}`);
      const data = await response.json();
      console.log('Courses data:', data);
      return data as Course[];
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
  }

  async getCourseById(id: number): Promise<Course | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
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
      const data = await response.json();
      console.log('Course created with ID:', data.courseId);
      return data.courseId;
    }
    catch (error) {
      console.error('Error creating course:', error);
      return null;
    }
  }

  async updateCourse(id: number, name: string, description: string | null): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description })
      });
      console.log('Course updated with ID:', id);
    } catch (error) {
      console.error('Error updating course:', error);
    }
  }

  async deleteCourse(id: number): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE'
      });
      console.log('Course deleted with ID:', id);
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  }
}
