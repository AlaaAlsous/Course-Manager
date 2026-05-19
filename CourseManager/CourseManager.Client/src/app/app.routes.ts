import { Routes } from '@angular/router';
import { AllCourses } from './all-courses/all-courses';
import { Groups } from './groups/groups';

export const routes: Routes = [
  // Default landing page redirects to Courses.
  { path: '', redirectTo: 'courses', pathMatch: 'full' },
  // Dedicated page for the All Courses view.
  { path: 'courses', component: AllCourses, data: { title: 'Courses' } },
  { path: 'groups', component: Groups, data: { title: 'Groups' } },
  // Fallback for unknown URLs.
  { path: '**', redirectTo: '' },
];
