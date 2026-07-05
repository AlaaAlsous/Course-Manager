import { Component, signal, computed, inject } from '@angular/core';
import { Person } from '../api-services/dtos';
import { Layout } from '../layout/layout';
import { RouterModule } from '@angular/router';
import { PersonApiService } from '../api-services/person-api-service';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { SnackbarService, SnackbarType } from '../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-persons',
  standalone: true,
  imports: [Layout, RouterModule],
  templateUrl: './persons.html',
})
export class Persons {
  private readonly personApiService = inject(PersonApiService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly snackbarService = inject(SnackbarService);

  title = signal('Participants');
  searchTerm = signal('');
  persons = signal<Person[]>([]);

  constructor() {
    void this.loadPersons();
  }

  private async loadPersons(): Promise<void> {
    const res = await this.personApiService.getAllPersons();
    if (res != null) {
      this.persons.set(res);
    }
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  filteredPersons = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.persons();

    return this.persons().filter((p) => p.fullName.toLowerCase().includes(term));
  });

  isSearching = computed(() => this.searchTerm().trim().length > 0);

  async deletePerson(personId: number, personName: string, event: Event): Promise<void> {
    event.stopPropagation();
    event.preventDefault();

    const confirmed = await this.confirmDialog.confirm({
      title: 'Delete Participant',
      message: `Are you sure you want to delete "${personName}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (!confirmed) return;

    const deleted = await this.personApiService.deletePerson(personId);
    if (deleted) {
      this.snackbarService.show(SnackbarType.Success, `"${personName}" deleted.`);
      await this.loadPersons();
    } else {
      this.snackbarService.show(SnackbarType.Failure, 'Could not delete participant.');
    }
  }
}
