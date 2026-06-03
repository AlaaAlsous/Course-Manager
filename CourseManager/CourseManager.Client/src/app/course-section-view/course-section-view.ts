import { Location } from '@angular/common';
import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Layout } from '../layout/layout';
import { ContentModule } from '../content-module/content-module';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CourseService } from '../all-courses/course.service';
import { CourseSectionGroup } from '../all-courses/course.model';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { CourseSectionApiService } from '../api-services/course-section-api-service';

@Component({
  selector: 'app-course-section-view',
  standalone: true,
  imports: [Layout, ContentModule, RouterModule, FormsModule],
  templateUrl: './course-section-view.html',
  styleUrl: './course-section-view.scss',
})
export class CourseSectionView {
  private readonly location = inject(Location);
  title = signal('Kurstillfälle');

  courseId = signal<number | null>(null);
  sectionId = signal<number | null>(null);

  groups: CourseSectionGroup[] = [];

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly courseService = inject(CourseService);
  private readonly courseSectionApiService = inject(CourseSectionApiService);
  private readonly confirmDialog = inject(ConfirmDialogService);

  sectionName = signal('');
  isEditing = signal(false);
  editName = '';

  constructor() {
    const courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    const sectionId = Number(this.route.snapshot.paramMap.get('sectionId'));

    this.courseId.set(courseId);
    this.sectionId.set(sectionId);

    const course = this.courseService.getById(courseId);
    const section = this.courseService.getSectionById(courseId, sectionId);

    if (section) {
      this.sectionName.set(section.name);
      this.title.set(`${course?.name ?? 'Program'} - ${section.name}`);
      this.groups = section.groups;
    }
  }

  groupRoute(groupId: number): (string | number)[] {
    return ['/groups', groupId];
  }

  createGroupRoute(): string[] {
    return ['/create-group'];
  }

  createGroupQueryParams(): { courseId: number; sectionId: number } | undefined {
    const courseId = this.courseId();
    const sectionId = this.sectionId();

    if (!courseId || !sectionId) {
      return undefined;
    }

    return { courseId, sectionId };
  }

  groupQueryParams(): { courseId: number; sectionId: number } | undefined {
    const courseId = this.courseId();
    const sectionId = this.sectionId();

    if (!courseId || !sectionId) {
      return undefined;
    }

    return { courseId, sectionId };
  }

  async deleteGroup(groupId: number): Promise<void> {
    const courseId = this.courseId();
    const sectionId = this.sectionId();

    if (!courseId || !sectionId) {
      return;
    }

    const confirmed = await this.confirmDialog.confirm({
      title: 'Ta bort grupp',
      message: 'Vill du verkligen ta bort denna grupp från kurstillfället?',
      confirmText: 'Ta bort',
      cancelText: 'Avbryt',
    });

    if (!confirmed) {
      return;
    }

    this.courseService.removeGroupFromSection(courseId, sectionId, groupId);
    this.groups = this.groups.filter((group) => group.id !== groupId);
  }

  startEdit(): void {
    this.editName = this.sectionName();
    this.isEditing.set(true);
  }

  async saveEdit(): Promise<void> {
    const courseId = this.courseId();
    const sectionId = this.sectionId();
    if (!courseId || !sectionId) return;

    await this.courseSectionApiService.updateCourseSection(
      sectionId,
      courseId,
      this.editName,
      null,
      null,
      null,
    );
    const updated = await this.courseSectionApiService.getCourseSectionById(sectionId);
    if (updated) {
      this.sectionName.set(updated.name);
      const course = this.courseService.getById(courseId);
      this.title.set(`${course?.name ?? 'Program'} - ${updated.name}`);
    }
    this.isEditing.set(false);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }

  async downloadAsZip(): Promise<void> {
    const sectionId = this.sectionId();
    if (!sectionId) return;

    try {
      const response = await fetch(
        `http://localhost:5053/api/files/download/course-section/${sectionId}`,
      );
      if (!response.ok) return;

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kurstillfalle_${sectionId}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading zip:', error);
    }
  }

  goBack(): void {
    const courseId = this.courseId();

    if (courseId) {
      this.router.navigate(['/course', courseId]);
      return;
    }

    this.router.navigate(['/home']);
  }
}
