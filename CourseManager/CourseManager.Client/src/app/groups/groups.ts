import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Layout } from '../layout/layout';

type GroupMember = {
  id: number;
  name: string;
};

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, Layout],
  templateUrl: './groups.html',
  styleUrl: './groups.scss',
})
export class Groups {
  title = signal('Groups');
  groupMembers: GroupMember[] = [
    { id: 1, name: 'Student 1' },
    { id: 2, name: 'Student 2' },
    { id: 3, name: 'Student 3' },
    { id: 4, name: 'Student 4' },
  ];

  onMemberClick(member: GroupMember): void {
    console.log('Clicked member:', member);
    // Senare kan detta bytas till navigation till person-komponent:
    // /persons/:id eller /participant/:id beroende på vad gruppen bestämmer.
  }
}
