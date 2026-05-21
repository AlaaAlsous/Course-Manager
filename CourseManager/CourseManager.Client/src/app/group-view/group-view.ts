import { Component, signal } from '@angular/core';
import { Layout } from '../layout/layout';
import ContentModule from '../content-module/content-module';

@Component({
  selector: 'app-group-view',
  imports: [Layout, ContentModule],
  templateUrl: './group-view.html',
  styleUrl: './group-view.scss',
})
export class GroupView {
  title = signal('PutGroupNameHere?');
}
