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

  goBack() {
    if (window.history.length > 1) {
      this.location.back();
      return;
    }
    this.router.navigate(['/participants']);
  }

  async createPerson(name: string) {
    const trimmedName = name.trim();
    if (!trimmedName) {
      this.snackbarService.show(SnackbarType.Failure, 'Name cannot be empty.');
      return;
    }
    const id = await this.personApiService.createPerson(trimmedName);
    if (id === null) {
      this.snackbarService.show(SnackbarType.Failure, `Could not create participant '${trimmedName}'`);
    } else {
      this.snackbarService.show(SnackbarType.Success, `Participant '${trimmedName}' created`);
      this.goBack();
    }
  }
}
