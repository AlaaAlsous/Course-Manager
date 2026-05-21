import { Component, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Layout } from '../layout/layout';
import {
  CreateCourseModal,
  CreateCoursePayload,
} from './components/create-course-modal/create-course-modal';

interface LatestCourse {
  id: number;
  name: string;
  created: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, Layout, CreateCourseModal],
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

  latestCourses: LatestCourse[] = [
    { id: 1, name: 'Course 1', created: '2026-05-11' },
    { id: 2, name: 'Course 2', created: '2026-05-07' },
  ];

  // Controls visibility of the create-course modal from the Home page button.
  showCreateCourseModal = false;

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
    this.router.navigate(['/group'], {
      queryParams: {id: id},
    });
  }

  goToCourse(id: number) {
    this.router.navigate(['/course'], {
      queryParams: {id: id},
    });
  }

  goToPerson(id: number) {
    this.router.navigate(['/participant'], {
      queryParams: {id: id},
    });
  }

  createGroup() {
    this.router.navigate(['/groups/create']);
  }

  createCourse() {
    // Opens the modal instead of navigating to a separate page.
    this.showCreateCourseModal = true;
  }

  onCreateCourseModalClose() {
    this.showCreateCourseModal = false;
  }

  onCreateCourse(course: CreateCoursePayload) {
    // Local UI update: prepend the newly created course to Latest Courses.
    const nextId = Math.max(0, ...this.latestCourses.map((c) => c.id)) + 1;
    const created = new Date().toISOString().split('T')[0] ?? '';

    this.latestCourses = [{ id: nextId, name: course.name, created }, ...this.latestCourses];
    this.showCreateCourseModal = false;
  }

  createPerson() {
    this.router.navigate(['/participants/create']);
  }
}
