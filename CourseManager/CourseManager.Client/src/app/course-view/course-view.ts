import { Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Layout } from '../layout/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ContentModule } from '../content-module/content-module';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { CourseApiService } from '../api-services/course-api-service';
import { CourseSectionApiService } from '../api-services/course-section-api-service';
import { CourseSection } from '../api-services/dtos';
import { GroupApiService } from '../api-services/group-api-service';

interface CourseSectionViewModel extends CourseSection {
  groupCount: number;
}

@Component({
  selector: 'app-course-view',
  standalone: true,
  imports: [Layout, RouterModule, ContentModule, FormsModule],
  templateUrl: './course-view.html',
})
export class CourseView {
  private readonly location = inject(Location);
  title = signal('Program');
  courseId = signal<number | null>(null);

  sections = signal<CourseSectionViewModel[]>([]);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly courseApiService = inject(CourseApiService);
  private readonly courseSectionApiService = inject(CourseSectionApiService);
  private readonly groupApiService = inject(GroupApiService);
  private readonly confirmDialog = inject(ConfirmDialogService);

  isEditing = signal(false);
  editName = '';

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.courseId.set(id);
    void this.loadCourseData();
  }

  private async loadCourseData(): Promise<void> {
    const courseId = this.courseId();

    if (!courseId) {
      return;
    }

    const [course, sections, allGroups] = await Promise.all([
      this.courseApiService.getCourseById(courseId),
      this.courseSectionApiService.getCourseSectionsByCourseId(courseId),
      this.groupApiService.getAllGroups(),
    ]);

    if (course) {
      this.title.set(course.name);
    }

    const groupCountBySectionId = new Map<number, number>();
    for (const group of allGroups) {
      groupCountBySectionId.set(
        group.courseSectionId,
        (groupCountBySectionId.get(group.courseSectionId) ?? 0) + 1,
      );
    }

    this.sections.set(
      sections.map((section) => ({
        ...section,
        groupCount: groupCountBySectionId.get(section.id) ?? 0,
      })),
    );
  }

  sectionRoute(sectionId: number): (string | number)[] {
    return ['/course', this.courseId() ?? 0, 'kurstillfalle', sectionId];
  }

  createKurstillfalleRoute(): (string | number)[] {
    return ['/course', this.courseId() ?? 0, 'kurstillfalle', 'new'];
  }

  async deleteSection(sectionId: number): Promise<void> {
    const confirmed = await this.confirmDialog.confirm({
      title: 'Ta bort kurstillfälle',
      message: 'Vill du verkligen ta bort detta kurstillfälle?',
      confirmText: 'Ta bort',
      cancelText: 'Avbryt',
    });

    if (!confirmed) {
      return;
    }

    await this.courseSectionApiService.deleteCourseSection(sectionId);
    await this.loadCourseData();
  }

  async deleteCourse(): Promise<void> {
    const courseId = this.courseId();
    if (!courseId) {
      return;
    }

    const confirmed = await this.confirmDialog.confirm({
      title: 'Ta bort program',
      message: 'Vill du verkligen ta bort detta program?',
      confirmText: 'Ta bort',
      cancelText: 'Avbryt',
    });

    if (!confirmed) {
      return;
    }

    const deleted = await this.courseApiService.deleteCourse(courseId);
    if (!deleted) {
      return;
    }

    this.router.navigate(['/all-courses']);
  }

  startEdit(): void {
    this.editName = this.title();
    this.isEditing.set(true);
  }

  async saveEdit(): Promise<void> {
  const courseId = this.courseId();
  if (!courseId) return;

  await this.courseApiService.updateCourse(
    courseId,
    this.editName,
    null
  );

  this.title.set(this.editName);

  this.isEditing.set(false);
}

  cancelEdit(): void {
    this.isEditing.set(false);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
