import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-course-view',
  templateUrl: './course-view.html',
  styleUrl: './course-view.scss',
})
export class CourseView {
  name: string = "Teknisk bananfysik 2026a";
  groups: string[] = [
    "Knatte & Bananlars",
    "Lotta & Bingus",
    "Fnöske & Tröske"
  ];
}
