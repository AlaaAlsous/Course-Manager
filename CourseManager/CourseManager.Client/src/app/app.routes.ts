import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Persons } from './persons/persons';
import { AllCourses } from './all-courses/all-courses';
import { GroupView } from './group-view/group-view';
import { CourseView } from './course-view/course-view';
import { CourseSectionView } from './course-section-view/course-section-view';
import { ParticipantDetail } from './participant-detail/participant-detail';
import { CreateCourse } from './create-course/create-course';
import { CreateGroup } from './create-group/create-group';
import { PersonCreator } from './person-creator/person-creator';
import { EditGroup } from './edit-group/edit-group';
import { NotFound } from './not-found/not-found';
import { CreateCourseSection } from './create-course-section/create-course-section';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: Home, data: { title: 'Home' } },
  { path: 'participants', component: Persons, data: { title: 'Participants' } },
  { path: 'participants/create', component: PersonCreator, data: { title: 'Create Participant' } },
  { path: 'participant', component: ParticipantDetail, data: { title: 'Participant Detail' } },
  { path: 'all-courses', component: AllCourses, data: { title: 'All Courses' } },
  { path: 'groups/:id', component: GroupView, data: { title: 'Group Detail' } },
  { path: 'groups/:id/edit', component: EditGroup, data: { title: 'Edit Group' } },
  { path: 'group', pathMatch: 'full', redirectTo: 'home' },
  { path: 'create-group', component: CreateGroup, data: { title: 'Create Group' } },
  { path: 'create-course', component: CreateCourse, data: { title: 'Create Course' } },
  {
    path: 'course/:courseId/course-section/new',
    component: CreateCourseSection,
    data: { title: 'Create Course Section' },
  },
  {
    path: 'course/:courseId/course-section/:sectionId',
    component: CourseSectionView,
    data: { title: 'Course Section' },
  },
  { path: 'course/:id', component: CourseView, data: { title: 'Course' } },
  { path: '**', component: NotFound, data: { title: 'Page not found' } },
];
