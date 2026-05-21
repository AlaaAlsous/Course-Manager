import { Injectable, signal } from '@angular/core';

export interface GroupMember {
  id: number;
  name: string;
}

export interface Group {
  id: number;
  name: string;
  members: GroupMember[];
}

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private readonly _groups = signal<Group[]>([
    {
      id: 1,
      name: 'Agile 4',
      members: [
        { id: 1, name: 'Nour' },
        { id: 2, name: 'Maria' },
        { id: 3, name: 'Arij' },
        { id: 4, name: 'Tariq' }
      ]
    },
    {
      id: 2,
      name: 'Frontend Team',
      members: [
        { id: 5, name: 'Sara' },
        { id: 6, name: 'Alex' }
      ]
    },
    {
      id: 3,
      name: 'Backend Team',
      members: [
        { id: 7, name: 'Adam' },
        { id: 8, name: 'Lina' }
      ]
    }
  ]);

  readonly groups = this._groups.asReadonly();
  getGroupById(id: number): Group | undefined {
  return this._groups().find(group => group.id === id);
}

  deleteGroup(id: number): void {
    this._groups.update(groups => groups.filter(group => group.id !== id));
  }
}

// This Service is placed here for simplicity, Services folder could be created if we have more services in the future.