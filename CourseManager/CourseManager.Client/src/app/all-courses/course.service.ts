import { Injectable, signal } from '@angular/core';
import { Course } from './course.model';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly _courses = signal<Course[]>([
    {
      id: 1,
      name: 'Technical Banana Science',
      people: ['Knatte', 'Bananlars'],
      groups: ['Knatte & Bananlars'],
      created: '2026-05-11',
    },
    {
      id: 2,
      name: 'Banana Conflict Studies',
      people: ['Lotta', 'Bingus'],
      groups: ['Lotta & Bingus'],
      created: '2026-05-07',
    },
    {
      id: 3,
      name: 'Historical Bananas',
      people: ['Fnöske', 'Tröske'],
      groups: ['Fnöske & Tröske'],
      created: '2026-05-05',
    },
  ]);

  courses = this._courses.asReadonly();

  getById(id: number): Course | undefined {
    return this._courses().find((c) => c.id === id);
  }

  addCourse(name: string): void {
    const nextId = Math.max(0, ...this._courses().map((c) => c.id)) + 1;
    const created = new Date().toISOString().split('T')[0] ?? '';

    this._courses.update((list) => [
      { id: nextId, name, people: [], groups: [], created },
      ...list,
    ]);
  }
}
