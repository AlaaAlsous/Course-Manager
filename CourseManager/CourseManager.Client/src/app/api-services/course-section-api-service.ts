import { Injectable } from '@angular/core';
import { CourseSection } from './dtos';

@Injectable({
  providedIn: 'root',
})
export class CourseSectionApiService {

  baseUrl = 'http://localhost:5053/api/course-section';

  constructor() { }

  async getAllCourseSections(): Promise<CourseSection[]> {
    try {
      const response = await fetch(`${this.baseUrl}`);
      const data = await response.json();
      return data as CourseSection[];
    } catch (error) {
      console.error('Error fetching course sections:', error);
      return [];
    }
  }

  async getCourseSectionsByCourseId(courseId: number): Promise<CourseSection[]> {
    try {
      const response = await fetch(`${this.baseUrl}/course/${courseId}`);
      const data = await response.json();
      return data as CourseSection[];
    } catch (error) {
      console.error('Error fetching course sections:', error);
      return [];
    }
  }

  async getCourseSectionById(id: number): Promise<CourseSection | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      const data = await response.json();
      return data as CourseSection;
    } catch (error) {
      console.error('Error fetching course section:', error);
      return null;
    }
  }

  async createCourseSection(courseId: number, name: string, description: string | null, startDate: string | null, endDate: string | null): Promise<number | null> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courseId, name, description, startDate, endDate })
      });
      const data = await response.json();
      return data.courseSectionId;
    } catch (error) {
      console.error('Error creating course section:', error);
      return null;
    }
  }

  async updateCourseSection(id: number, courseId: number, name: string, description: string | null, startDate: string | null, endDate: string | null): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courseId, name, description, startDate, endDate })
      });
    } catch (error) {
      console.error('Error updating course section:', error);
    }
  }

  async deleteCourseSection(id: number): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error deleting course section:', error);
    }
  }

}
