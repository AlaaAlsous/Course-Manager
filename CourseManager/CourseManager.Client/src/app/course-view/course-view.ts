import { Component, signal } from '@angular/core';
import { Layout } from '../layout/layout';

@Component({
  selector: 'app-course-view',
  standalone: true,
  imports: [Layout],
  templateUrl: './course-view.html',
  styleUrl: './course-view.scss',
})
export class CourseView {
  title = signal('Home');
  name: string = 'Teknisk bananfysik 2026a';
  groups: string[] = ['Knatte & Bananlars', 'Lotta & Bingus', 'Fnöske & Tröske'];
}
