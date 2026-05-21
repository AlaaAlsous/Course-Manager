import { Component, signal } from '@angular/core';
import { Layout } from '../layout/layout';

@Component({
  selector: 'app-group-view',
  imports: [Layout],
  templateUrl: './group-view.html',
  styleUrl: './group-view.scss',
})
export class GroupView {
  title = signal('PutGroupNameHere?');
}
