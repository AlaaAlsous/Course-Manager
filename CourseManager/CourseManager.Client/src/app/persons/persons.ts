import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Person } from '../api-services/dtos';
import { Layout } from '../layout/layout';
import { RouterModule } from '@angular/router';
import { PersonApiService } from '../api-services/person-api-service';

@Component({
  selector: 'app-persons',
  standalone: true,
  imports: [CommonModule, Layout, RouterModule],
  templateUrl: './persons.html',
})
export class Persons implements OnInit {
  private readonly personApiService = inject(PersonApiService)

  title = signal('Deltagare');
  searchTerm = signal('');
  persons = signal<any[]>([]);

  async ngOnInit() {
    const res = await this.personApiService.getAllPersons();
    if(res != null) {
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

    return this.persons().filter(
      (p) => p.fullName.toLowerCase().includes(term) || p.fullName.toLowerCase().includes(term),
    );
  });
}
