import { Component, signal, computed, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { Layout } from '../layout/layout';
import { Snackbar } from '../shared/snackbar/snackbar';
import { CourseApiService } from '../api-services/course-api-service';
import { Course } from '../api-services/dtos';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgIf, Layout, Snackbar],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home {
  title = signal('');
  private readonly courseList = signal<Course[]>([]);

  private readonly router = inject(Router);
  private readonly courseApiService = inject(CourseApiService);
  private readonly confirmDialog = inject(ConfirmDialogService);

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
