import { Component, signal, computed, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Layout } from '../layout/layout';
import { CreateCourseModal, CreateCoursePayload } from '../create-course-modal/create-course-modal';
import { CourseService } from '../all-courses/course.service';
import { Snackbar } from '../shared/snackbar/snackbar';
import { SnackbarService } from '../shared/snackbar/snackbar.service';
import { SnackbarType } from '../shared/snackbar/snackbar.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, Layout, CreateCourseModal, Snackbar],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home {
  title = signal('Home');

  private readonly router = inject(Router);
  private readonly courseService = inject(CourseService);
  private readonly snackbarService = inject(SnackbarService);

  latestGroups = [
    { id: 1, name: 'Group A', created: '2026-05-10' },
    { id: 2, name: 'Group B', created: '2026-05-09' },
    { id: 3, name: 'Group C', created: '2026-05-08' },
  ];

  latestCourses = computed(() =>
    this.courseService
      .courses()
      .slice()
      .sort((a, b) => b.created.localeCompare(a.created))
      .slice(0, 5),
  );

  showCreateCourseModal = false;

  latestPeople = [
    { id: 1, name: 'Alice', created: '2026-05-12' },
    { id: 2, name: 'Bob', created: '2026-05-10' },
    { id: 3, name: 'Charlie', created: '2026-05-09' },
  ];

  getRelativeDate(dateString: string): string {
    const created = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  }

  goToGroup(id: number): void {
    this.router.navigate(['/groups', id]);
  }

  goToCourse(id: number) {
    this.router.navigate(['/course', id]);
  }

  goToPerson(id: number) {
    this.router.navigate(['/participant'], {
      queryParams: { id },
    });
  }

  createGroup() {
    this.router.navigate(['/create-group']);
  }

  createCourse() {
    this.showCreateCourseModal = true;
  }

  onCreateCourseModalClose() {
    this.showCreateCourseModal = false;
  }

  onCreateCourse(course: CreateCoursePayload) {
    this.courseService.addCourse(course.name);

    this.snackbarService.show(SnackbarType.Success, 'Course created successfully!');

    this.showCreateCourseModal = false;
  }

  createPerson() {
    this.router.navigate(['/participants/create']);
  }
}
