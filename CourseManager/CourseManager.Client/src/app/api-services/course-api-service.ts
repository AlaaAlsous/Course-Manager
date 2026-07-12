import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from './dtos';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CourseApiService {
  private baseUrl = `${environment.apiUrl}/course`;
  private readonly http = inject(HttpClient);

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
      const data = await this.http.get<any[]>(`${this.baseUrl}`).toPromise();
      return (data ?? []).map((course) => this.mapCourse(course));
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
  }

  async getCourseById(id: number): Promise<Course | null> {
    try {
      const data = await this.http.get<any>(`${this.baseUrl}/${id}`).toPromise();
      return this.mapCourse(data);
    } catch (error) {
      console.error('Error fetching course:', error);
      return null;
    }
  }

  async createCourse(name: string, description: string | null): Promise<number | null> {
    try {
      const data = await this.http.post<any>(`${this.baseUrl}`, { name, description }).toPromise();
      return data.courseId;
    } catch (error) {
      console.error('Error creating course:', error);
      return null;
    }
  }

  async updateCourse(id: number, name: string, description: string | null): Promise<boolean> {
    try {
      await this.http.put(`${this.baseUrl}/${id}`, { name, description }).toPromise();
      return true;
    } catch (error) {
      console.error('Error updating course:', error);
      return false;
    }
  }

  async deleteCourse(id: number): Promise<boolean> {
    try {
      await this.http.delete(`${this.baseUrl}/${id}`).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting course:', error);
      return false;
    }
  }
}
