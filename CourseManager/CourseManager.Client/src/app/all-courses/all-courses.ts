import { Component, signal, computed, inject } from '@angular/core';
import { Layout } from '../layout/layout';
import { NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseService } from '../all-courses/course.service';

@Component({
  selector: 'app-all-courses',
  standalone: true,
  imports: [Layout, NgFor, RouterModule],
  templateUrl: './all-courses.html',
  styleUrl: './all-courses.scss',
})
export class AllCourses {
  title = signal('Alla program');

  private readonly courseService = inject(CourseService);

  searchTerm = signal('');

  courses = this.courseService.courses;

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
