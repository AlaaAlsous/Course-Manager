import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Layout } from '../layout/layout';
import { ContentModule } from '../content-module/content-module';
import { GroupApiService } from '../api-services/group-api-service';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { PersonApiService } from '../api-services/person-api-service';
import { Snackbar } from '../shared/snackbar/snackbar';
import { SnackbarService, SnackbarType } from '../shared/snackbar/snackbar.service';

interface GroupMemberViewModel {
  id: number;
  name: string;
}

interface GroupViewModel {
  id: number;
  name: string;
  courseSectionId: number;
  members: GroupMemberViewModel[];
}

@Component({
  selector: 'app-group-view',
  imports: [Layout, ContentModule, FormsModule, RouterLink, Snackbar],
  templateUrl: './group-view.html',
  styleUrl: './group-view.scss',
})
export class GroupView {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly groupApiService = inject(GroupApiService);
  private readonly personApiService = inject(PersonApiService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly snackbarService = inject(SnackbarService);

  private readonly groupId = Number(this.route.snapshot.paramMap.get('id'));
  private readonly returnCourseId = Number(this.route.snapshot.queryParamMap.get('courseId'));
  private readonly returnSectionId = Number(this.route.snapshot.queryParamMap.get('sectionId'));

  newMemberName = '';
  isEditing = signal(false);
  editName = '';
  readonly group = signal<GroupViewModel | null>(null);

  readonly title = computed(() => this.group()?.name ?? 'Gruppen hittades inte');

  constructor() {
    void this.loadGroupData();
  }

  private async loadGroupData(): Promise<void> {
    const group = await this.groupApiService.getGroupById(this.groupId);

    if (!group) {
      this.group.set(null);
      return;
    }

    const members = await this.groupApiService.getAllPeople(this.groupId);
    this.group.set({
      ...group,
      members: members.map((member) => ({
        id: member.id,
        name: member.fullName,
      })),
    });
  }

  async addMember(): Promise<void> {
    const selectedGroup = this.group();
    const memberName = this.newMemberName.trim();

    if (!selectedGroup || !memberName) {
      this.snackbarService.show(SnackbarType.Failure, 'Ange ett namn för medlemmen.');
      return;
    }

    const allPeople = await this.personApiService.getAllPersons();
    const existingPerson = allPeople.find(
      (person) => person.fullName.toLowerCase() === memberName.toLowerCase(),
    );

    let relationAdded = false;

    if (existingPerson) {
      relationAdded = await this.groupApiService.addPerson(this.groupId, existingPerson.id);
    } else {
      const createdPersonId = await this.personApiService.createPerson(memberName);

      if (!createdPersonId) {
        this.snackbarService.show(SnackbarType.Failure, 'Kunde inte skapa deltagare.');
        return;
      }

      relationAdded = await this.groupApiService.addPerson(this.groupId, createdPersonId);
      await this.personApiService.getPersonById(createdPersonId);
    }

    if (!relationAdded) {
      this.snackbarService.show(SnackbarType.Failure, 'Kunde inte lägga till medlem i gruppen.');
      return;
    }

    await this.loadGroupData();
    this.newMemberName = '';
    this.snackbarService.show(SnackbarType.Success, 'Medlem tillagd.');
  }

  async removeMember(memberId: number): Promise<void> {
    if (!this.group()) {
      return;
    }

    const confirmed = await this.confirmDialog.confirm({
      title: 'Ta bort medlem',
      message: 'Vill du verkligen ta bort medlemmen från gruppen?',
      confirmText: 'Ta bort',
      cancelText: 'Avbryt',
    });

    if (!confirmed) {
      return;
    }

    const removed = await this.groupApiService.deletePerson(this.groupId, memberId);

    if (!removed) {
      this.snackbarService.show(SnackbarType.Failure, 'Kunde inte ta bort medlemmen.');
      return;
    }

    await this.loadGroupData();
    this.snackbarService.show(SnackbarType.Success, 'Medlem borttagen.');
  }

  async deleteGroup(): Promise<void> {
    const selectedGroup = this.group();
    if (!selectedGroup) {
      return;
    }

    const confirmed = await this.confirmDialog.confirm({
      title: 'Ta bort grupp',
      message: 'Vill du verkligen ta bort denna grupp?',
      confirmText: 'Ta bort',
      cancelText: 'Avbryt',
    });

    if (!confirmed) {
      return;
    }

    const deleted = await this.groupApiService.deleteGroup(selectedGroup.id);

    if (!deleted) {
      this.snackbarService.show(SnackbarType.Failure, 'Kunde inte ta bort gruppen.');
      return;
    }

    this.snackbarService.show(SnackbarType.Success, 'Gruppen togs bort.');
    this.goBack();
  }

  startEdit(): void {
    this.editName = this.group()?.name ?? '';
    this.isEditing.set(true);
  }

  async saveEdit(): Promise<void> {
    await this.groupApiService.updateGroup(this.groupId, this.editName, this.returnSectionId);
    await this.loadGroupData();
    this.isEditing.set(false);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }

  goBack(): void {
    if (this.returnCourseId && this.returnSectionId) {
      this.router.navigate(['/course', this.returnCourseId, 'kurstillfalle', this.returnSectionId]);
      return;
    }

    this.router.navigate(['/home']);
  }
}
