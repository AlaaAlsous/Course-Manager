import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Layout } from '../layout/layout';
import { CourseSectionApiService } from '../api-services/course-section-api-service';
import { SnackbarService, SnackbarType } from '../shared/snackbar/snackbar.service';

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
  private readonly courseSectionApiService = inject(CourseSectionApiService);
  private readonly snackbarService = inject(SnackbarService);

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

  async createKurstillfalle(): Promise<void> {
    this.submitted = true;

    if (!this.isFormValid) {
      return;
    }

    if (!Number.isFinite(this.courseId) || this.courseId <= 0) {
      this.router.navigate(['/home']);
      return;
    }

    const createdSectionId = await this.courseSectionApiService.createCourseSection(
      this.courseId,
      this.name.trim(),
      this.description.trim() || null,
      this.startDate || null,
      this.endDate || null,
    );

    if (!createdSectionId) {
      this.snackbarService.show(SnackbarType.Failure, 'Kunde inte skapa kurstillfälle.');
      return;
    }

    await this.courseSectionApiService.getCourseSectionById(createdSectionId);

    this.router.navigate(['/course', this.courseId]);
  }
}
