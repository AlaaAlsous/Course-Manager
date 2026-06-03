import { Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Layout } from '../layout/layout';
import { Router } from '@angular/router';
import { PersonApiService } from '../api-services/person-api-service';
import { Snackbar } from '../shared/snackbar/snackbar';
import { SnackbarService, SnackbarType } from '../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-person-creator',
  imports: [Layout, FormsModule, Snackbar],
  templateUrl: './person-creator.html',
  styleUrl: './person-creator.scss',
})
export class PersonCreator {
  private readonly location = inject(Location);
  private readonly personApiService = inject(PersonApiService);
  private readonly snackbarService = inject(SnackbarService);

  title = signal('Skapa deltagare');

  constructor(private router: Router) {}

  goBack() {
    if (window.history.length > 1) {
      this.location.back();
      return;
    }
    this.router.navigate(['/participants']);
  }

  async createPerson(name: string) {
    const id = await this.personApiService.createPerson(name);
    console.log(id);
    if(id === null)
      this.snackbarService.show(SnackbarType.Failure, `Kunde inte skapa deltagare '${name}'`);
    else {
      this.snackbarService.show(SnackbarType.Success, `Deltagare '${name}' skapades`);
      this.goBack();
    }
  }
}
