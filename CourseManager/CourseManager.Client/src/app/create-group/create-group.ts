import { Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Layout } from '../layout/layout';
import { SnackbarType } from '../shared/snackbar/snackbar.service';
import { SnackbarService } from '../shared/snackbar/snackbar.service';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
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
  private readonly route = inject(ActivatedRoute);
  private readonly confirmDialog = inject(ConfirmDialogService);

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

  private readonly returnCourseId = Number(this.route.snapshot.queryParamMap.get('courseId'));
  private readonly returnSectionId = Number(this.route.snapshot.queryParamMap.get('sectionId'));

  constructor(
    private router: Router,
    private snackbarService: SnackbarService,
  ) {}

  goBack() {
    if (this.hasValidReturnSection()) {
      this.router.navigate(['/course', this.returnCourseId, 'kurstillfalle', this.returnSectionId]);
      return;
    }

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

  async removePersonFromGroup(personId: number): Promise<void> {
    const person = this.groupPeople.find((p) => p.id === personId);

    if (!person) {
      return;
    }

    const confirmed = await this.confirmDialog.confirm({
      title: 'Ta bort person',
      message: `Vill du verkligen ta bort ${person.name} från gruppen?`,
      confirmText: 'Ta bort',
      cancelText: 'Avbryt',
    });

    if (!confirmed) {
      return;
    }

    this.groupPeople = this.groupPeople.filter((p) => p.id !== personId);

    if (!this.allPeople.some((p) => p.id === person.id)) {
      this.allPeople = [...this.allPeople, person].sort((a, b) => a.id - b.id);
    }
  }

  addExistingCourse() {
    if (!this.selectedCourseId) return;

    const course = this.allCourses.find((c) => c.id === this.selectedCourseId);
    if (!course) return;

    this.groupCourses.push(course);

    this.allCourses = this.allCourses.filter((c) => c.id !== this.selectedCourseId);

    this.selectedCourseId = null;
  }

  async removeCourseFromGroup(courseId: number): Promise<void> {
    const course = this.groupCourses.find((c) => c.id === courseId);

    if (!course) {
      return;
    }

    const confirmed = await this.confirmDialog.confirm({
      title: 'Ta bort kurs',
      message: `Vill du verkligen ta bort ${course.name} från gruppen?`,
      confirmText: 'Ta bort',
      cancelText: 'Avbryt',
    });

    if (!confirmed) {
      return;
    }

    this.groupCourses = this.groupCourses.filter((c) => c.id !== courseId);

    if (!this.allCourses.some((c) => c.id === course.id)) {
      this.allCourses = [...this.allCourses, course].sort((a, b) => a.id - b.id);
    }
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

    if (this.hasValidReturnSection()) {
      this.router.navigate(['/course', this.returnCourseId, 'kurstillfalle', this.returnSectionId]);
      return;
    }

    this.router.navigate(['/all-courses']);
  }

  private hasValidReturnSection(): boolean {
    return (
      Number.isFinite(this.returnCourseId) &&
      this.returnCourseId > 0 &&
      Number.isFinite(this.returnSectionId) &&
      this.returnSectionId > 0
    );
  }
}
