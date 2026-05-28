import { Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { Layout } from '../layout/layout';
import { SnackbarType } from '../shared/snackbar/snackbar.service';
import { SnackbarService } from '../shared/snackbar/snackbar.service';
interface Person {
  id: number;
  name: string;
}

interface Course {
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
  private readonly location = inject(Location);

  title = signal('Create Group');

  name = '';

  groupPeople: Person[] = [];

  allPeople: Person[] = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
  ];

  groupCourses: Course[] = [];

  allCourses: Course[] = [
    { id: 1, name: 'Course A' },
    { id: 2, name: 'Course B' },
    { id: 3, name: 'Course C' },
  ];

  selectedPersonId: number | null = null;
  selectedCourseId: number | null = null;

  constructor(
    private router: Router,
    private snackbarService: SnackbarService,
  ) {}

  goBack() {
    if (window.history.length > 1) {
      this.location.back();
      return;
    }

    this.router.navigate(['/all-courses']);
  }

  addExistingPerson() {
    if (!this.selectedPersonId) return;

    const person = this.allPeople.find((p) => p.id === this.selectedPersonId);
    if (!person) return;

    this.groupPeople.push(person);

    this.allPeople = this.allPeople.filter((p) => p.id !== this.selectedPersonId);

    this.selectedPersonId = null;
  }

  addExistingCourse() {
    if (!this.selectedCourseId) return;

    const course = this.allCourses.find((c) => c.id === this.selectedCourseId);
    if (!course) return;

    this.groupCourses.push(course);

    this.allCourses = this.allCourses.filter((c) => c.id !== this.selectedCourseId);

    this.selectedCourseId = null;
  }

  goToCreatePerson() {
    this.router.navigate(['/participants/create']);
  }

  createGroup() {
    if (!this.name.trim()) return;

    console.log('Group created:', {
      name: this.name,
      people: this.groupPeople,
    });
    this.snackbarService.show(SnackbarType.Success, 'Group created successfully!');
    this.router.navigate(['/groups']);
  }
}
