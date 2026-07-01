import { Location } from '@angular/common';
import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Layout } from '../layout/layout';
import { ContentModule } from '../content-module/content-module';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { CourseSectionApiService } from '../api-services/course-section-api-service';
import { CourseApiService } from '../api-services/course-api-service';
import { GroupApiService } from '../api-services/group-api-service';
import { SnackbarService, SnackbarType } from '../shared/snackbar/snackbar.service';
import { environment } from '../../environments/environment';

interface CourseSectionGroup {
  id: number;
  name: string;
  memberCount: number;
}

@Component({
  selector: 'app-course-section-view',
  standalone: true,
  imports: [Layout, ContentModule, RouterModule, FormsModule],
  templateUrl: './course-section-view.html',
})
export class CourseSectionView {
  private readonly location = inject(Location);
  title = signal('');

  courseId = signal<number | null>(null);
  sectionId = signal<number | null>(null);

  groups = signal<CourseSectionGroup[]>([]);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly courseApiService = inject(CourseApiService);
  private readonly courseSectionApiService = inject(CourseSectionApiService);
  private readonly groupApiService = inject(GroupApiService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly snackbarService = inject(SnackbarService);

  sectionName = signal('');
  courseName = signal('');
  isEditing = signal(false);
  editName = '';
  readonly editInput = viewChild<ElementRef<HTMLInputElement>>('editInput');

  breadcrumbs = computed(() => {
    const courseId = this.courseId();
    const course = this.courseName();
    if (courseId && course) {
      return [
        { label: course, route: `/course/${courseId}` },
        { label: this.sectionName() },
      ];
    }
    return [{ label: this.sectionName() }];
  });

  constructor() {
    const courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    const sectionId = Number(this.route.snapshot.paramMap.get('sectionId'));

    this.courseId.set(courseId);
    this.sectionId.set(sectionId);
    void this.loadSectionData();
  }

  private async loadSectionData(): Promise<void> {
    const courseId = this.courseId();
    const sectionId = this.sectionId();

    if (!courseId || !sectionId) {
      return;
    }

    const [course, section, groups] = await Promise.all([
      this.courseApiService.getCourseById(courseId),
      this.courseSectionApiService.getCourseSectionById(sectionId),
      this.groupApiService.getGroupByCourseSectionId(sectionId),
    ]);

    if (!section) {
      return;
    }

    this.sectionName.set(section.name);
    this.courseName.set(course?.name ?? '');
    this.title.set(`${course?.name ?? 'Course'} - ${section.name}`);

    const groupsWithCounts = await Promise.all(
      groups.map(async (group) => {
        const members = await this.groupApiService.getAllPeople(group.id);
        return {
          id: group.id,
          name: group.name,
          memberCount: members.length,
        };
      }),
    );

    this.groups.set(groupsWithCounts);
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
    if (!this.sectionId()) {
      return;
    }

    const confirmed = await this.confirmDialog.confirm({
      title: 'Delete Group',
      message: 'Are you sure you want to delete this group from the course section?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (!confirmed) {
      return;
    }

    const deleted = await this.groupApiService.deleteGroup(groupId);
    if (deleted) {
      this.snackbarService.show(SnackbarType.Success, 'Group deleted.');
    }
    await this.loadSectionData();
  }

  startEdit(): void {
    this.editName = this.sectionName();
    this.isEditing.set(true);
    setTimeout(() => {
      this.editInput()?.nativeElement?.focus();
    });
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
      const course = await this.courseApiService.getCourseById(courseId);
      this.title.set(`${course?.name ?? 'Course'} - ${updated.name}`);
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
        `${environment.apiUrl}/files/download/course-section/${sectionId}`,
      );
      if (!response.ok) return;

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `course_section_${sectionId}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading zip:', error);
    }
  }

  async deleteCourseSection(): Promise<void> {
    const sectionId = this.sectionId();
    if (!sectionId) return;

    const confirmed = await this.confirmDialog.confirm({
      title: 'Delete Course Section',
      message: 'Are you sure you want to delete this course section?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (!confirmed) return;

    const deleted = await this.courseSectionApiService.deleteCourseSection(sectionId);
    if (deleted) {
      this.snackbarService.show(SnackbarType.Success, 'Course section deleted.');
    }
    this.goBack();
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
