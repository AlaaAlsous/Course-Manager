import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Layout } from '../layout/layout';
import { Group, GroupsService } from './group-panel/groups.service';

@Component({
  selector: 'app-groups',
  imports: [Layout],
  templateUrl: './groups.html',
  styleUrl: './groups.scss'
})
export class Groups {
  title = signal('Groups');

  private readonly groupsService = inject(GroupsService);
  private readonly router = inject(Router);

  groups = this.groupsService.groups;

  searchTerm = signal('');
  selectedGroupId = signal<number | null>(null);
  statusMessage = signal('');

  selectedGroup = computed(() => {
    const selectedId = this.selectedGroupId();

    if (selectedId === null) {
      return undefined;
    }

    return this.groups().find(group => group.id === selectedId);
  });

  filteredGroups = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();

    if (!search) {
      return this.groups();
    }

    return this.groups().filter(group =>
      group.name.toLowerCase().includes(search) ||
      group.members.some(member =>
        member.name.toLowerCase().includes(search)
      )
    );
  });

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  onSelectGroup(group: Group): void {
    this.selectedGroupId.set(group.id);
    this.statusMessage.set(`Selected group: ${group.name}`);
  }

  isSelected(groupId: number): boolean {
    return this.selectedGroupId() === groupId;
  }

  onCreateClick(): void {
  this.router.navigate(['/create-group']);
}

  onShowClick(): void {
    const group = this.selectedGroup();

    if (!group) {
      this.statusMessage.set('Select a group first.');
      return;
    }

    this.statusMessage.set(`Showing group: ${group.name}`);
  }

  onEditClick(): void {
    const group = this.selectedGroup();

    if (!group) {
      this.statusMessage.set('Select a group first.');
      return;
    }

    this.statusMessage.set(`Edit group will be connected later: ${group.name}`);
  }

  onDeleteClick(): void {
    const group = this.selectedGroup();

    if (!group) {
      this.statusMessage.set('Select a group first.');
      return;
    }

    const confirmed = confirm(`Delete group "${group.name}"?`);

    if (!confirmed) {
      return;
    }

    this.groupsService.deleteGroup(group.id);
    this.selectedGroupId.set(null);
    this.statusMessage.set(`Deleted group: ${group.name}`);
  }
}