import { Component, signal, computed, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { Layout } from '../layout/layout';
import { CourseService } from '../all-courses/course.service';
import { Snackbar } from '../shared/snackbar/snackbar';
import { SnackbarService } from '../shared/snackbar/snackbar.service';
import { SnackbarType } from '../shared/snackbar/snackbar.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgIf, Layout, Snackbar],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home {
  title = signal('Hem');

  private readonly router = inject(Router);
  private readonly courseService = inject(CourseService);
  private readonly snackbarService = inject(SnackbarService);

  courses = computed(() =>
    this.courseService
      .courses()
      .slice()
      .sort((a, b) => b.created.localeCompare(a.created)),
  );

  getRelativeDate(dateString: string): string {
    const created = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'I dag';
    if (diffDays === 1) return 'För 1 dag sedan';
    return `För ${diffDays} dagar sedan`;
  }

  goToCourse(id: number) {
    this.router.navigate(['/course', id]);
  }

  createCourse() {
    this.router.navigate(['/create-course']);
  }

  createPerson() {
    this.router.navigate(['/participants/create']);
  }
}
