import { Routes } from '@angular/router';
import { Persons } from './persons/persons';
import { AllCourses } from './all-courses/all-courses';
import { Groups } from './groups/groups';
import { CourseView } from './course-view/course-view';
import { Home } from './home/home';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: Home, data: { title: 'Home' } },
  { path: 'participants', component: Persons, data: { title: 'Participants' } },
  { path: 'all-courses', component: AllCourses, data: { title: 'All Courses' } },
  { path: 'groups', component: Groups, data: { title: 'Groups' } },
  { path: 'course', component: CourseView, data: { title: 'Course' } },
];
