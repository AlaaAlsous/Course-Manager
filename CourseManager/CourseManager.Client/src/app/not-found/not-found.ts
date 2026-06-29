import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Layout } from '../layout/layout';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [Layout, RouterLink],
  templateUrl: './not-found.html',
})
export class NotFound {
  title = signal('Sidan hittades inte');
}
