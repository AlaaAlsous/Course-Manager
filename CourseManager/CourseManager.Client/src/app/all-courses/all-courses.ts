import { Component, signal, computed, inject } from '@angular/core';
import { Layout } from '../layout/layout';
import { NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseApiService } from '../api-services/course-api-service';
import { Course } from '../api-services/dtos';

@Component({
  selector: 'app-all-courses',
  standalone: true,
  imports: [Layout, NgFor, NgIf, RouterModule],
  templateUrl: './all-courses.html',
  styleUrl: './all-courses.scss',
})
export class AllCourses {
  title = signal('Alla program');

  private readonly courseApiService = inject(CourseApiService);
  private readonly courseList = signal<Course[]>([]);

  searchTerm = signal('');

  constructor() {
    void this.loadCourses();
  }

  private async loadCourses(): Promise<void> {
    const courses = await this.courseApiService.getAllCourses();
    this.courseList.set(courses);
  }

  courses = computed(() =>
    this.courseList()
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  );

  filteredCourses = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.courses();

    return this.courses().filter((c) => c.name.toLowerCase().includes(term));
  });

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }
}
