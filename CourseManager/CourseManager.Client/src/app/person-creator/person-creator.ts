import { Component, signal } from '@angular/core';
import { Layout } from '../layout/layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-person-creator',
  imports: [Layout],
  templateUrl: './person-creator.html',
  styleUrl: './person-creator.scss',
})
export class PersonCreator {
  title = signal('Participant Creator');

  constructor(private router: Router) {}

  createPerson() {
    this.router.navigate(['/participants']);
  }
}
