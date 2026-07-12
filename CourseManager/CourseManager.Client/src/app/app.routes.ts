import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Persons } from './persons/persons';
import { AllCourses } from './all-courses/all-courses';
import { AllCourseSections } from './all-course-sections/all-course-sections';
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
import { Login } from './login/login';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login, data: { title: 'Login' } },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  { path: 'home', component: Home, data: { title: 'Home' }, canActivate: [authGuard] },
  {
    path: 'participants',
    component: Persons,
    data: { title: 'Participants' },
    canActivate: [authGuard],
  },
  {
    path: 'participants/create',
    component: PersonCreator,
    data: { title: 'Create Participant' },
    canActivate: [authGuard],
  },
  {
    path: 'participant',
    component: ParticipantDetail,
    data: { title: 'Participant Detail' },
    canActivate: [authGuard],
  },
  {
    path: 'all-courses',
    component: AllCourses,
    data: { title: 'Programs' },
    canActivate: [authGuard],
  },
  {
    path: 'all-course-sections',
    component: AllCourseSections,
    data: { title: 'Course Sections' },
    canActivate: [authGuard],
  },
  {
    path: 'groups/:id',
    component: GroupView,
    data: { title: 'Group Detail' },
    canActivate: [authGuard],
  },
  {
    path: 'groups/:id/edit',
    component: EditGroup,
    data: { title: 'Edit Group' },
    canActivate: [authGuard],
  },
  {
    path: 'group',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'create-group',
    component: CreateGroup,
    data: { title: 'Create Group' },
    canActivate: [authGuard],
  },
  {
    path: 'create-course',
    component: CreateCourse,
    data: { title: 'Create Program' },
    canActivate: [authGuard],
  },
  {
    path: 'course/:courseId/course-section/new',
    component: CreateCourseSection,
    data: { title: 'Create Course Section' },
    canActivate: [authGuard],
  },
  {
    path: 'course/:courseId/course-section/:sectionId',
    component: CourseSectionView,
    data: { title: 'Course Section' },
    canActivate: [authGuard],
  },
  {
    path: 'course/:id',
    component: CourseView,
    data: { title: 'Program' },
    canActivate: [authGuard],
  },
  { path: '**', component: NotFound, data: { title: 'Page not found' } },
];
