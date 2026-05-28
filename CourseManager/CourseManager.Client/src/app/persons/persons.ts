import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Person } from './person.model';
import { Layout } from '../layout/layout';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-persons',
  standalone: true,
  imports: [CommonModule, Layout, RouterModule],
  templateUrl: './persons.html',
  styleUrls: ['./persons.scss'],
})
export class Persons {
  title = signal('Deltagare');
  searchTerm = signal('');

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  filteredPersons = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();

    if (!term) return this.persons;

    return this.persons.filter(
      (p) => p.name.toLowerCase().includes(term) || p.email.toLowerCase().includes(term),
    );
  });

  persons: Person[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      imageUrl: 'https://example.com/john-doe.jpg',
      courses: ['Course 1', 'Course 2'],
      notes: [
        {
          id: 1,
          text: 'Note 1',
          createdAt: '2023-01-01',
        },
      ],
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '098-765-4321',
      imageUrl: 'https://example.com/jane-smith.jpg',
      courses: ['Course 2', 'Course 3'],
      notes: [
        {
          id: 2,
          text: 'Note 2',
          createdAt: '2023-01-02',
        },
      ],
    },
    {
      id: 3,
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      phone: '555-1234',
      imageUrl: 'https://example.com/alice-johnson.jpg',
      courses: ['Course 1', 'Course 3'],
      notes: [
        {
          id: 3,
          text: 'Note 3',
          createdAt: '2023-01-03',
        },
      ],
    },
  ];
}
