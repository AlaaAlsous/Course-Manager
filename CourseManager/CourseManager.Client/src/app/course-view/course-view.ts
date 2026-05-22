import { Component, signal, inject } from '@angular/core';
import { Layout } from '../layout/layout';
import { NgIf, NgFor } from '@angular/common';
import ContentModule from '../content-module/content-module';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../all-courses/course.service';

@Component({
  selector: 'app-course-view',
  standalone: true,
  imports: [Layout, NgIf, NgFor, ContentModule],
  templateUrl: './course-view.html',
  styleUrl: './course-view.scss',
})
export class CourseView {
  title = signal('Course');
  courseId = signal<number | null>(null);

  name = '';
  people: string[] = [];
  groups: string[] = [];

  currentview = signal<'groups' | 'participants'>('groups');

  private readonly route = inject(ActivatedRoute);
  private readonly courseService = inject(CourseService);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.courseId.set(id);

    const course = this.courseService.getById(id);

    if (course) {
      this.title.set(course.name);
      this.name = course.name;
      this.people = course.people;
      this.groups = course.groups;
    }
  }

  switchView(view: 'groups' | 'participants') {
    this.currentview.set(view);
  }
}
