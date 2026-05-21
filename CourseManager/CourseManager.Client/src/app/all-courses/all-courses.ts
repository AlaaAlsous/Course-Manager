import { Component, signal } from '@angular/core';
import { Layout } from '../layout/layout';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-all-courses',
  standalone: true,
  imports: [Layout, NgFor],
  templateUrl: './all-courses.html',
  styleUrl: './all-courses.scss',
})
export class AllCourses {
  title = signal('All Courses');

  courses = [
    { id: 1, name: 'Teknisk bananvetenskap' },
    { id: 2, name: 'Banankonflikter' },
    { id: 3, name: 'Historiska bananer' },
  ];

  filteredCourses = this.courses;

  searchTerm = signal('');

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const term = input.value.toLowerCase();

    this.filteredCourses = this.courses.filter((c) => c.name.toLowerCase().includes(term));
  }
}
