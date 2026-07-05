import { Component, signal, computed, inject } from '@angular/core';
import { Layout } from '../layout/layout';
import { RouterModule } from '@angular/router';
import { CourseApiService } from '../api-services/course-api-service';
import { Course } from '../api-services/dtos';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { SnackbarService, SnackbarType } from '../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-all-courses',
  standalone: true,
  imports: [Layout, RouterModule],
  templateUrl: './all-courses.html',
})
export class AllCourses {
  title = signal('All Courses');

  private readonly courseApiService = inject(CourseApiService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly courseList = signal<Course[]>([]);

  searchTerm = signal('');

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

  filteredCourses = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.courses();

    return this.courses().filter((c) => c.name.toLowerCase().includes(term));
  });

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  async deleteCourse(courseId: number, courseName: string, event: Event): Promise<void> {
    event.stopPropagation();
    event.preventDefault();

    const confirmed = await this.confirmDialog.confirm({
      title: 'Delete Course',
      message: `Are you sure you want to delete "${courseName}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (!confirmed) return;

    const deleted = await this.courseApiService.deleteCourse(courseId);
    if (deleted) {
      this.snackbarService.show(SnackbarType.Success, `"${courseName}" deleted.`);
      await this.loadCourses();
    } else {
      this.snackbarService.show(SnackbarType.Failure, 'Could not delete course.');
    }
  }
}
