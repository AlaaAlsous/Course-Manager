import { Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Layout } from '../layout/layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-person-creator',
  imports: [Layout],
  templateUrl: './person-creator.html',
  styleUrl: './person-creator.scss',
})
export class PersonCreator {
  private readonly location = inject(Location);

  title = signal('Participant Creator');

  constructor(private router: Router) {}

  goBack() {
    if (window.history.length > 1) {
      this.location.back();
      return;
    }

    this.router.navigate(['/participants']);
  }

  createPerson() {
    this.router.navigate(['/participants']);
  }
}
