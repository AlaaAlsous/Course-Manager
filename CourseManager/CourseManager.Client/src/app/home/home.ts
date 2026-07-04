import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Layout } from '../layout/layout';
import { CourseApiService } from '../api-services/course-api-service';
import { CourseSectionApiService } from '../api-services/course-section-api-service';
import { PersonApiService } from '../api-services/person-api-service';
import { Course, CourseSection } from '../api-services/dtos';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { SnackbarService, SnackbarType } from '../shared/snackbar/snackbar.service';

interface CourseWithMeta extends Course {
  sectionCount: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, Layout],
  templateUrl: './home.html',
})
export class Home {
  title = signal('');
  searchTerm = signal('');
  private readonly courseList = signal<Course[]>([]);
  private readonly courseSections = signal<CourseSection[]>([]);

  totalCourses = computed(() => this.courseList().length);
  totalParticipants = signal(0);
  totalSections = signal(0);

  private readonly router = inject(Router);
  private readonly courseApiService = inject(CourseApiService);
  private readonly courseSectionApiService = inject(CourseSectionApiService);
  private readonly personApiService = inject(PersonApiService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly snackbarService = inject(SnackbarService);

  constructor() {
    void this.loadDashboardData();
  }

  private async loadDashboardData(): Promise<void> {
    const [courses, sections, persons] = await Promise.all([
      this.courseApiService.getAllCourses(),
      this.courseSectionApiService.getAllCourseSections(),
      this.personApiService.getAllPersons(),
    ]);

    this.courseList.set(courses);
    this.courseSections.set(sections);
    this.totalSections.set(sections.length);
    this.totalParticipants.set(persons.length);
  }

  coursesWithMeta = computed<CourseWithMeta[]>(() => {
    const sections = this.courseSections();
    const sectionCountByCourseId = new Map<number, number>();

    for (const section of sections) {
      sectionCountByCourseId.set(
        section.courseId,
        (sectionCountByCourseId.get(section.courseId) ?? 0) + 1,
      );
    }

    return this.courseList()
      .map((course) => ({
        ...course,
        sectionCount: sectionCountByCourseId.get(course.id) ?? 0,
      }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  });

  recentCourses = computed(() => this.coursesWithMeta().slice(0, 5));

  hasMoreCourses = computed(() => this.coursesWithMeta().length > 5);

  filteredCourses = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.coursesWithMeta();

    return this.coursesWithMeta().filter(
      (c) =>
        c.name.toLowerCase().includes(term) || (c.description ?? '').toLowerCase().includes(term),
    );
  });

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  getRelativeDate(dateString: string): string {
    const created = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMinutes < 60) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffWeeks === 1) return '1 week ago';
    if (diffWeeks < 5) return `${diffWeeks} weeks ago`;
    if (diffMonths === 1) return '1 month ago';
    if (diffMonths < 12) return `${diffMonths} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  getDescriptionSnippet(description: string | null): string {
    if (!description) return '';
    return description.length > 120 ? description.slice(0, 120) + '...' : description;
  }

  goToCourse(id: number) {
    this.router.navigate(['/course', id]);
  }

  createCourse() {
    this.router.navigate(['/create-course']);
  }

  createPerson() {
    this.router.navigate(['/participants/create']);
  }

  viewAllCourses() {
    this.router.navigate(['/all-courses']);
  }

  viewAllParticipants() {
    this.router.navigate(['/participants']);
  }

  viewAllSections() {
    this.router.navigate(['/all-course-sections']);
  }

  async deleteCourse(courseId: number, courseName: string, event: Event): Promise<void> {
    event.stopPropagation();

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
      await this.loadDashboardData();
    } else {
      this.snackbarService.show(SnackbarType.Failure, 'Could not delete course.');
    }
  }
}
