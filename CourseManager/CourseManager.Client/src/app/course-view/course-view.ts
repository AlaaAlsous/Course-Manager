import { Component, signal } from '@angular/core';
import { Layout } from '../layout/layout';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-course-view',
  standalone: true,
  imports: [Layout, NgIf],
  templateUrl: './course-view.html',
  styleUrl: './course-view.scss',
})
export class CourseView {
  title = signal('Teknisk bananfysik 2026a');
  name: string = 'Teknisk bananfysik 2026a';
  people: string[] = ['Knatte', 'Bananlars', 'Lotta', 'Bingus', 'Fnöske', 'Tröske'];
  groups: string[] = ['Knatte & Bananlars', 'Lotta & Bingus', 'Fnöske & Tröske'];

 currentview = signal<'groups' | 'participants'>('groups');

  switchView(view: 'groups' | 'participants') {
    this.currentview.set(view);
  }
}
