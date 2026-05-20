import { Component, signal } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Layout } from '../layout/layout';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, RouterLink, Layout],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home {
  title = signal('Home');
  latestGroups = [
    { id: 1, name: 'Group A', created: '2026-05-10' },
    { id: 2, name: 'Group B', created: '2026-05-09' },
    { id: 3, name: 'Group C', created: '2026-05-08' },
  ];

  latestCourses = [
    { id: 1, name: 'Course 1', created: '2026-05-11' },
    { id: 2, name: 'Course 2', created: '2026-05-07' },
  ];

  latestPeople = [
    { id: 1, name: 'Alice', created: '2026-05-12' },
    { id: 2, name: 'Bob', created: '2026-05-10' },
    { id: 3, name: 'Charlie', created: '2026-05-09' },
  ];

  constructor(private router: Router) {}

  getRelativeDate(dateString: string): string {
    const created = new Date(dateString);
    const now = new Date();

    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  }

  goToGroup(id: number) {
    this.router.navigate(['/groups', id]);
  }

  goToCourse(id: number) {
    this.router.navigate(['/all-courses', id]);
  }

  goToPerson(id: number) {
    this.router.navigate(['/participants', id]);
  }
}
