import { Location } from '@angular/common';
import { Component, signal, inject } from '@angular/core';
import { Layout } from '../layout/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../all-courses/course.service';
import { CourseSection } from '../all-courses/course.model';
import { RouterModule } from '@angular/router';
import ContentModule from '../content-module/content-module';

@Component({
  selector: 'app-course-view',
  standalone: true,
  imports: [Layout, RouterModule, ContentModule],
  templateUrl: './course-view.html',
  styleUrl: './course-view.scss',
})
export class CourseView {
  private readonly location = inject(Location);
  title = signal('Kurs');
  courseId = signal<number | null>(null);

  sections = signal<CourseSection[]>([]);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly courseService = inject(CourseService);

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

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
