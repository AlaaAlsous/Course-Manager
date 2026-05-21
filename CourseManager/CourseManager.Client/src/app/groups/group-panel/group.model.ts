export interface GroupMember {
  id: number;
  name: string;
}

export interface Group {
  id: number;
  name: string;
  members: GroupMember[];
}

// This file could end up in a shared models folder if we have more components,
// that need to use the Group and GroupMember interfaces. For now, it's placed here for simplicity.