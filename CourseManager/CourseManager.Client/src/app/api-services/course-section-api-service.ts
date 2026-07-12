import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CourseSection } from './dtos';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CourseSectionApiService {
  private baseUrl = `${environment.apiUrl}/course-section`;
  private readonly http = inject(HttpClient);

  private mapCourseSection(data: any): CourseSection {
    return {
      id: data.id ?? data.courseSectionId,
      courseId: data.courseId,
      name: data.name,
      description: data.description ?? null,
      createdAt: data.createdAt,
      startDate: data.startDate ?? null,
      endDate: data.endDate ?? null,
    };
  }

  async getAllCourseSections(): Promise<CourseSection[]> {
    try {
      const data = await this.http.get<any[]>(`${this.baseUrl}`).toPromise();
      return (data ?? []).map((section) => this.mapCourseSection(section));
    } catch (error) {
      console.error('Error fetching course sections:', error);
      return [];
    }
  }

  async getCourseSectionsByCourseId(courseId: number): Promise<CourseSection[]> {
    try {
      const data = await this.http.get<any[]>(`${this.baseUrl}/course/${courseId}`).toPromise();
      return (data ?? []).map((section) => this.mapCourseSection(section));
    } catch (error) {
      console.error('Error fetching course sections:', error);
      return [];
    }
  }

  async getCourseSectionById(id: number): Promise<CourseSection | null> {
    try {
      const data = await this.http.get<any>(`${this.baseUrl}/${id}`).toPromise();
      return this.mapCourseSection(data);
    } catch (error) {
      console.error('Error fetching course section:', error);
      return null;
    }
  }

  async createCourseSection(
    courseId: number,
    name: string,
    description: string | null,
    startDate: string | null,
    endDate: string | null,
  ): Promise<number | null> {
    try {
      const data = await this.http
        .post<any>(`${this.baseUrl}`, { courseId, name, description, startDate, endDate })
        .toPromise();
      return data.courseSectionId;
    } catch (error) {
      console.error('Error creating course section:', error);
      return null;
    }
  }

  async updateCourseSection(
    id: number,
    name: string,
    description: string | null,
    startDate: string | null,
    endDate: string | null,
  ): Promise<boolean> {
    try {
      await this.http
        .put(`${this.baseUrl}/${id}`, { name, description, startDate, endDate })
        .toPromise();
      return true;
    } catch (error) {
      console.error('Error updating course section:', error);
      return false;
    }
  }

  async deleteCourseSection(id: number): Promise<boolean> {
    try {
      await this.http.delete(`${this.baseUrl}/${id}`).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting course section:', error);
      return false;
    }
  }
}
