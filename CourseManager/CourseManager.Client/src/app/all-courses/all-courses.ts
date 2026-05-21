import { Component, signal } from '@angular/core';
import { Layout } from '../layout/layout';

@Component({
  selector: 'app-all-courses',
  standalone: true,
  imports: [Layout],
  templateUrl: './all-courses.html',
  styleUrl: './all-courses.scss',
})
export class AllCourses {
  // Used by the shared layout header for the current page title.
  title = signal('All Courses');

  searchTerm = signal('');

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.searchTerm.set(input.value);
  }
}