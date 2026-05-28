import { Location } from '@angular/common';
import { Component, signal, inject } from '@angular/core';
import { Layout } from '../layout/layout';
import ContentModule from '../content-module/content-module';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CourseService } from '../all-courses/course.service';
import { CourseSectionGroup } from '../all-courses/course.model';

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

  groupQueryParams(): { courseId: number; sectionId: number } | undefined {
    const courseId = this.courseId();
    const sectionId = this.sectionId();

    if (!courseId || !sectionId) {
      return undefined;
    }

    return { courseId, sectionId };
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
