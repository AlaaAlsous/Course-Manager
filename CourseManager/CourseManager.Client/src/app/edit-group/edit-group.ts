import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Layout } from '../layout/layout';
import { GroupsService } from '../groups/group-panel/groups.service';

@Component({
  selector: 'app-edit-group',
  imports: [FormsModule, Layout],
  templateUrl: './edit-group.html',
  styleUrl: './edit-group.scss',
})
export class EditGroup {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly groupsService = inject(GroupsService);

  private readonly groupId = Number(this.route.snapshot.paramMap.get('id'));
  readonly group = this.groupsService.getGroupById(this.groupId);

  readonly title = signal(this.group ? `Edit ${this.group.name}` : 'Group not found');
  name = this.group?.name ?? '';
  readonly statusMessage = signal('');

  saveGroup(): void {
    if (!this.group) {
      this.statusMessage.set('Group could not be found.');
      return;
    }

    const name = this.name.trim();

    if (!name) {
      this.statusMessage.set('Group name is required.');
      return;
    }

    this.groupsService.updateGroup({
      ...this.group,
      name,
    });

    this.router.navigate(['/groups', this.groupId]);
  }

  cancel(): void {
    if (!this.group) {
      this.router.navigate(['/groups']);
      return;
    }

    this.router.navigate(['/groups', this.groupId]);
  }
}