import { Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Layout } from '../layout/layout';
import { PersonApiService } from '../api-services/person-api-service';
import { SnackbarService, SnackbarType } from '../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-person-creator',
  imports: [Layout, FormsModule],
  templateUrl: './person-creator.html',
})
export class PersonCreator {
  private readonly location = inject(Location);
  private readonly personApiService = inject(PersonApiService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly router = inject(Router);

  title = signal('Create Participant');

  name = '';
  submitted = false;

  get isFormValid(): boolean {
    return this.name.trim().length > 0;
  }

  goBack() {
    if (window.history.length > 1) {
      this.location.back();
      return;
    }
    this.router.navigate(['/participants']);
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;

    if (!this.isFormValid) {
      return;
    }

    const id = await this.personApiService.createPerson(this.name.trim());
    if (id === null) {
      this.snackbarService.show(SnackbarType.Failure, 'Could not create participant.');
      return;
    }

    this.snackbarService.show(SnackbarType.Success, 'Participant created!');
    this.router.navigate(['/participants']);
  }
}
