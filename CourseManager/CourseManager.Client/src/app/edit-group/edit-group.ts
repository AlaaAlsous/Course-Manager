import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Layout } from '../layout/layout';
import { GroupApiService } from '../api-services/group-api-service';
import { Group } from '../api-services/dtos';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-edit-group',
  imports: [FormsModule, Layout],
  templateUrl: './edit-group.html',
})
export class EditGroup {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly groupApiService = inject(GroupApiService);
  private readonly confirmDialog = inject(ConfirmDialogService);

  private readonly groupId = Number(this.route.snapshot.paramMap.get('id'));
  private readonly returnCourseId = Number(this.route.snapshot.queryParamMap.get('courseId'));
  private readonly returnSectionId = Number(this.route.snapshot.queryParamMap.get('sectionId'));
  readonly group = signal<Group | null>(null);

  readonly title = signal('Edit Group');
  name = '';
  readonly statusMessage = signal('');

  constructor() {
    void this.loadGroup();
  }

  private async loadGroup(): Promise<void> {
    const loadedGroup = await this.groupApiService.getGroupById(this.groupId);
    this.group.set(loadedGroup);

    if (loadedGroup) {
      this.title.set(`Edit ${loadedGroup.name}`);
      this.name = loadedGroup.name;
      return;
    }

    this.title.set('Group not found');
  }

  async saveGroup(): Promise<void> {
    const selectedGroup = this.group();

    if (!selectedGroup) {
      this.statusMessage.set('Group could not be found.');
      return;
    }

    const name = this.name.trim();

    if (!name) {
      this.statusMessage.set('Group name is required.');
      return;
    }

    await this.groupApiService.updateGroup(selectedGroup.id, name);
    await this.groupApiService.getGroupById(selectedGroup.id);

    this.router.navigate(['/groups', this.groupId], {
      queryParams: this.getReturnQueryParams(),
    });
  }

  cancel(): void {
    if (!this.group()) {
      this.router.navigate(['/home']);
      return;
    }

    this.router.navigate(['/groups', this.groupId], {
      queryParams: this.getReturnQueryParams(),
    });
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
      this.statusMessage.set('Kunde inte ta bort gruppen.');
      return;
    }

    this.router.navigate(['/home']);
  }

  private getReturnQueryParams(): { courseId: number; sectionId: number } | undefined {
    if (
      Number.isFinite(this.returnCourseId) &&
      this.returnCourseId > 0 &&
      Number.isFinite(this.returnSectionId) &&
      this.returnSectionId > 0
    ) {
      return {
        courseId: this.returnCourseId,
        sectionId: this.returnSectionId,
      };
    }

    return undefined;
  }
}
