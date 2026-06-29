import { Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Layout } from '../layout/layout';
import { CourseApiService } from '../api-services/course-api-service';
import { SnackbarService, SnackbarType } from '../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [FormsModule, Layout],
  templateUrl: './create-course.html',
})
export class CreateCourse {
  private readonly location = inject(Location);

  title = signal('Create Course');

  name = '';
  submitted = false;

  constructor(
    private router: Router,
    private courseApiService: CourseApiService,
    private snackbarService: SnackbarService,
  ) {}

  get isFormValid(): boolean {
    return this.name.trim().length > 0;
  }

  goBack() {
    if (window.history.length > 1) {
      this.location.back();
      return;
    }

    this.router.navigate(['/home']);
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;

    if (!this.isFormValid) {
      return;
    }

    const createdCourseId = await this.courseApiService.createCourse(this.name.trim(), null);

    if (!createdCourseId) {
      this.snackbarService.show(SnackbarType.Failure, 'Could not create course.');
      return;
    }

    await this.courseApiService.getCourseById(createdCourseId);
    this.snackbarService.show(SnackbarType.Success, 'Course created!');
    this.router.navigate(['/home']);
  }
}
