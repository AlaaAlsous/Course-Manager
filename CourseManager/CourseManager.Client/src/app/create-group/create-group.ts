import { Location } from '@angular/common';
import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Layout } from '../layout/layout';
import { SnackbarType } from '../shared/snackbar/snackbar.service';
import { SnackbarService } from '../shared/snackbar/snackbar.service';
import { Snackbar } from '../shared/snackbar/snackbar';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { PersonApiService } from '../api-services/person-api-service';
import { GroupApiService } from '../api-services/group-api-service';
import { CourseSectionApiService } from '../api-services/course-section-api-service';

interface Person {
  id: number;
  name: string;
}

@Component({
  selector: 'app-create-group',
  imports: [FormsModule, Layout, NgFor, Snackbar],
  templateUrl: './create-group.html',
  styleUrl: './create-group.scss',
})
export class CreateGroup {
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly personApiService = inject(PersonApiService);
  private readonly groupApiService = inject(GroupApiService);
  private readonly courseSectionApiService = inject(CourseSectionApiService);

  title = signal('Create Group');

  name = '';

  groupPeople = signal<Person[]>([]);

  allPeople: Person[] = [];

  selectedPersonId: number | null = null;

  private readonly returnCourseId = Number(this.route.snapshot.queryParamMap.get('courseId'));
  private readonly returnSectionId = Number(this.route.snapshot.queryParamMap.get('sectionId'));

  @ViewChild('personNameInput') nameInputRef!: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private snackbarService: SnackbarService,
  ) {
    void this.loadInitialData();
  }

  private async loadInitialData(): Promise<void> {
    const people = await this.personApiService.getAllPersons();

    this.allPeople = people.map((person) => ({
      id: person.id,
      name: person.fullName,
    }));
  }

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

    this.groupPeople.update((people) => [...people, person]);

    this.allPeople = this.allPeople.filter((p) => p.id !== this.selectedPersonId);

    this.selectedPersonId = null;
  }

  async removePersonFromGroup(personId: number): Promise<void> {
    const person = this.groupPeople().find((p) => p.id === personId);

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

    this.groupPeople.update((people) => people.filter((p) => p.id !== personId));

    if (!this.allPeople.some((p) => p.id === person.id)) {
      this.allPeople = [...this.allPeople, person].sort((a, b) => a.id - b.id);
    }
  }

  async createPerson() {
    const name = this.nameInputRef.nativeElement.value;
    const id = await this.personApiService.createPerson(name);
    console.log(id);
    if (id === null) {
      this.snackbarService.show(SnackbarType.Failure, `Kunde inte skapa deltagare '${name}'`);
      return;
    } else {
      this.snackbarService.show(SnackbarType.Success, `Deltagare '${name}' skapades`);
    }

    const person = await this.personApiService.getPersonById(id);
    if (person) {
      this.groupPeople.update((people) => [...people, { id, name }]);
      this.nameInputRef.nativeElement.value = '';
    }
  }

  async createGroup(): Promise<void> {
    const groupName = this.name.trim();

    if (!groupName) {
      this.snackbarService.show(SnackbarType.Failure, 'Kan inte skapa grupp utan namn');
      return;
    }

    if (!this.hasValidReturnSection()) {
      this.snackbarService.show(SnackbarType.Failure, 'Kan inte skapa grupp utan kurstillfälle.');
      return;
    }

    const createdGroupId = await this.groupApiService.createGroup(groupName, this.returnSectionId);

    if (!createdGroupId) {
      this.snackbarService.show(SnackbarType.Failure, 'Kunde inte skapa grupp.');
      return;
    }

    for (const person of this.groupPeople()) {
      await this.groupApiService.addPerson(createdGroupId, person.id);
    }

    await this.groupApiService.getGroupById(createdGroupId);
    await this.courseSectionApiService.getCourseSectionById(this.returnSectionId);
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
