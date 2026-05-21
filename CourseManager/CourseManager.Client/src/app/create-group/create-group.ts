import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { Layout } from '../layout/layout';

interface Person {
  id: number;
  name: string;
}

@Component({
  selector: 'app-create-group',
  imports: [FormsModule, Layout, NgFor],
  templateUrl: './create-group.html',
  styleUrl: './create-group.scss',
})
export class CreateGroup {
  title = signal('Create Group');

  name = '';

  groupPeople: Person[] = [];

  allPeople: Person[] = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
  ];

  selectedPersonId: number | null = null;

  constructor(private router: Router) {}

  addExistingPerson() {
    if (!this.selectedPersonId) return;

    const person = this.allPeople.find((p) => p.id === this.selectedPersonId);
    if (!person) return;

    this.groupPeople.push(person);

    this.allPeople = this.allPeople.filter((p) => p.id !== this.selectedPersonId);

    this.selectedPersonId = null;
  }

  goToCreatePerson() {
    this.router.navigate(['/create-person']);
  }

  createGroup() {
    if (!this.name.trim()) return;

    console.log('Group created:', {
      name: this.name,
      people: this.groupPeople,
    });

    this.router.navigate(['/groups']);
  }
}
