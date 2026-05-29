import { Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Layout } from '../layout/layout';
import { CourseService } from '../all-courses/course.service';
import { SnackbarService, SnackbarType } from '../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [FormsModule, Layout],
  templateUrl: './create-course.html',
  styleUrl: './create-course.scss',
})
export class CreateCourse {
  private readonly location = inject(Location);

  title = signal('Skapa kurs');

  name = '';
  description = '';
  submitted = false;

  constructor(
    private router: Router,
    private courseService: CourseService,
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

  onSubmit() {
    this.submitted = true;

    if (!this.isFormValid) {
      return;
    }

    this.courseService.addCourse(this.name.trim());
    this.snackbarService.show(SnackbarType.Success, 'Kurs skapad!');
    this.router.navigate(['/home']);
  }
}
