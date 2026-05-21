import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Persons } from './persons/persons';
import { AllCourses } from './all-courses/all-courses';
import { Groups } from './groups/groups';
import { GroupView } from './group-view/group-view';
import { CourseView } from './course-view/course-view';
import { ParticipantDetail } from './participant-detail/participant-detail';
import { CreateGroup } from './create-group/create-group';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: Home, data: { title: 'Home' } },
  { path: 'participants', component: Persons, data: { title: 'Participants' } },
  { path: 'participant', component: ParticipantDetail, data: { title: 'Participant Detail' } },
  { path: 'all-courses', component: AllCourses, data: { title: 'All Courses' } },
  { path: 'groups', component: Groups, data: { title: 'Groups' } },
  { path: 'group', component: GroupView, data: { title: 'Groups' } },
  { path: 'create-group', component: CreateGroup, data: { title: 'Create Group' } },
  { path: 'course', component: CourseView, data: { title: 'Course' } },
];
