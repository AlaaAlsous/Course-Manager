import { Location } from '@angular/common';
import { Component, signal, inject } from '@angular/core';
import { Layout } from '../layout/layout';
import ContentModule from '../content-module/content-module';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CourseService } from '../all-courses/course.service';
import { CourseSectionGroup } from '../all-courses/course.model';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-course-section-view',
  standalone: true,
  imports: [Layout, ContentModule, RouterModule],
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
  private readonly confirmDialog = inject(ConfirmDialogService);

  constructor() {
    const courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    const sectionId = Number(this.route.snapshot.paramMap.get('sectionId'));

    this.courseId.set(courseId);
    this.sectionId.set(sectionId);

    const course = this.courseService.getById(courseId);
    const section = this.courseService.getSectionById(courseId, sectionId);

    if (section) {
      this.title.set(`${course?.name ?? 'Kurs'} - ${section.name}`);
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

  goBack(): void {
    const courseId = this.courseId();

    if (courseId) {
      this.router.navigate(['/course', courseId]);
      return;
    }

    this.router.navigate(['/home']);
  }
}
