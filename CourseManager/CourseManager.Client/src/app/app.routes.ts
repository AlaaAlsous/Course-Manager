import { Routes } from '@angular/router';
import { Groups } from './Groups/groups';

export const routes: Routes = [
   { path: 'groups', component: Groups, data: { title: 'Groups' } }


];
