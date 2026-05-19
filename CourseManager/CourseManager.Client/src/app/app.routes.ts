import { Routes } from '@angular/router';
import { Persons } from './persons/persons';
import { AllCourses } from './all-courses/all-courses';
import { Groups } from './groups/groups';
import { CourseView } from './course-view/course-view';




export const routes: Routes = [
  // Default landing page redirects to Courses.
  { path: '', redirectTo: 'courses', pathMatch: 'full' },
  // Dedicated page for the All Courses view.
   {
    path: 'participants',
    component: Persons
  },

  {
    path: '',
    redirectTo: 'participants',
    pathMatch: 'full'
  },
  { path: 'courses', component: AllCourses, data: { title: 'Courses' } },
  { path: 'groups', component: Groups, data: { title: 'Groups' } },
  { path: 'some-example-course-idunno', component: CourseView, data: { title: 'Kursvy' } },
  // Fallback for unknown URLs.
  { path: '**', redirectTo: '' },
]
