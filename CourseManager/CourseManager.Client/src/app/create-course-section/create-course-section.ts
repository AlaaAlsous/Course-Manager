import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Layout } from '../layout/layout';
import { CourseService } from '../all-courses/course.service';

@Component({
  selector: 'app-create-course-section',
  standalone: true,
  imports: [Layout, FormsModule],
  templateUrl: './create-course-section.html',
  styleUrl: './create-course-section.scss',
})
export class CreateCourseSection {
  title = signal('Skapa kurstillfälle');

  name = '';
  description = '';
  startDate = '';
  endDate = '';
  submitted = false;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly courseService = inject(CourseService);

  readonly courseId = Number(this.route.snapshot.paramMap.get('courseId'));

  get isFormValid(): boolean {
    if (!this.name.trim()) {
      return false;
    }

    if (this.startDate && this.endDate) {
      return this.startDate <= this.endDate;
    }

    return true;
  }

  goBack(): void {
    if (Number.isFinite(this.courseId) && this.courseId > 0) {
      this.router.navigate(['/course', this.courseId]);
      return;
    }

    this.router.navigate(['/home']);
  }

  createKurstillfalle(): void {
    this.submitted = true;

    if (!this.isFormValid) {
      return;
    }

    if (!Number.isFinite(this.courseId) || this.courseId <= 0) {
      this.router.navigate(['/home']);
      return;
    }

    this.courseService.addSection(this.courseId, {
      name: this.name.trim(),
      description: this.description.trim() || undefined,
      startDate: this.startDate || undefined,
      endDate: this.endDate || undefined,
    });

    this.router.navigate(['/course', this.courseId]);
  }
}
