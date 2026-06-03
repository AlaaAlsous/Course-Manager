import { Injectable } from '@angular/core';
import { CourseSection } from './dtos';

@Injectable({
  providedIn: 'root',
})
export class CourseSectionApiService {

  baseUrl = 'http://localhost:5053/api/course-section';

  constructor() { }

  async getAllCourseSections(): Promise<CourseSection[] | null> {
    try {
      const response = await fetch(`${this.baseUrl}`);
      if (!response.ok) {
          console.error('Error fetching course sections:', response.statusText);
          return null;
        }
        const data = await response.json();
        console.log('Course sections data:', data);
        return data as CourseSection[];    
    } catch (error) {
      console.error('Error fetching course sections:', error);
      return null;
    }
  }

  async getCourseSectionsByCourseId(courseId: number): Promise<CourseSection[] | null> {
    try {
      const response = await fetch(`${this.baseUrl}/course/${courseId}`);
      if (!response.ok) {
        console.error('Error fetching course sections:', response.statusText);
        return null;
      }
      const data = await response.json();
      console.log('Course sections data:', data);
      return data as CourseSection[];
    } catch (error) {
      console.error('Error fetching course sections:', error);
      return null;
    }
  }

  async getCourseSectionById(id: number): Promise<CourseSection | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        console.error('Error fetching course section:', response.statusText);
        return null;
      }
      const data = await response.json();
      console.log('Course section data:', data);
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
     if(!response.ok) {
        console.error('Error creating course section:', response.statusText);
        return null;
      }
        const data = await response.json();
        console.log('Course section created with ID:', data.courseSectionId);
        return data.courseSectionId;
    } catch (error) {
      console.error('Error creating course section:', error);
      return null;
    }
  }

  async updateCourseSection(id: number, courseId: number, name: string, description: string | null, startDate: string | null, endDate: string | null): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courseId, name, description, startDate, endDate })
      });
      if (!response.ok) {
        console.error('Error updating course section:', response.statusText);
        return false;
      }
      console.log('Course section updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating course section:', error);
      return false;
    }
  }

  async deleteCourseSection(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        console.error('Error deleting course section:', response.statusText);
        return false;
      }
      console.log('Course section deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting course section:', error);
      return false;
    }
  }

}
