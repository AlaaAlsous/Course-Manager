import { Location } from '@angular/common';
import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Layout } from '../layout/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../all-courses/course.service';
import { CourseSection } from '../all-courses/course.model';
import { RouterModule } from '@angular/router';
import { ContentModule } from '../content-module/content-module';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { CourseApiService } from '../api-services/course-api-service';

@Component({
  selector: 'app-course-view',
  standalone: true,
  imports: [Layout, RouterModule, ContentModule, FormsModule],
  templateUrl: './course-view.html',
  styleUrl: './course-view.scss',
})
export class CourseView {
  private readonly location = inject(Location);
  title = signal('Program');
  courseId = signal<number | null>(null);

  sections = signal<CourseSection[]>([]);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly courseService = inject(CourseService);
  private readonly courseApiService = inject(CourseApiService);
  private readonly confirmDialog = inject(ConfirmDialogService);

  isEditing = signal(false);
  editName = '';

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.courseId.set(id);

    const course = this.courseService.getById(id);

    if (course) {
      this.title.set(course.name);
      this.sections.set(this.courseService.getSectionsByCourseId(id));
    }
  }

  sectionRoute(sectionId: number): (string | number)[] {
    return ['/course', this.courseId() ?? 0, 'kurstillfalle', sectionId];
  }

  createKurstillfalleRoute(): (string | number)[] {
    return ['/course', this.courseId() ?? 0, 'kurstillfalle', 'new'];
  }

  async deleteSection(sectionId: number): Promise<void> {
    const courseId = this.courseId();

    if (!courseId) {
      return;
    }

    const confirmed = await this.confirmDialog.confirm({
      title: 'Ta bort kurstillfälle',
      message: 'Vill du verkligen ta bort detta kurstillfälle?',
      confirmText: 'Ta bort',
      cancelText: 'Avbryt',
    });

    if (!confirmed) {
      return;
    }

    this.courseService.deleteSection(courseId, sectionId);
    this.sections.set(this.courseService.getSectionsByCourseId(courseId));
  }

  startEdit(): void {
    this.editName = this.title();
    this.isEditing.set(true);
  }

  async saveEdit(): Promise<void> {
    const courseId = this.courseId();
    if (!courseId) return;

    await this.courseApiService.updateCourse(courseId, this.editName, null);
    const updated = await this.courseApiService.getCourseById(courseId);
    if (updated) {
      this.title.set(updated.name);
    }
    this.isEditing.set(false);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
