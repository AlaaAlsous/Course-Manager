import { Injectable, signal } from '@angular/core';
import { Course, CourseSection } from './course.model';

export interface CreateCourseSectionPayload {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly _courses = signal<Course[]>([
    {
      id: 1,
      name: 'Teknisk bananologi',
      sections: [
        { id: 2023, name: '2023' },
        { id: 2024, name: '2024' },
      ],
      people: [],
      groups: [],
      created: '2026-05-11',
    },
    {
      id: 2,
      name: 'Banan konflikthantering',
      sections: [{ id: 2025, name: '2025' }],
      people: [],
      groups: [],
      created: '2026-05-07',
    },
    {
      id: 3,
      name: 'Historia om bananer',
      sections: [{ id: 2026, name: '2026' }],
      people: [],
      groups: [],
      created: '2026-05-05',
    },
  ]);

  private readonly _courseSections = signal<CourseSection[]>([
    {
      id: 2023,
      courseId: 1,
      name: '2023',
      people: ['Nour', 'Maria', 'Arij', 'Tariq'],
      groups: [{ id: 1, name: 'Agile 4', memberCount: 4 }],
    },
    {
      id: 2024,
      courseId: 1,
      name: '2024',
      people: ['Sara', 'Alex', 'Adam', 'Lina'],
      groups: [
        { id: 2, name: 'Frontend Team', memberCount: 2 },
        { id: 3, name: 'Backend Team', memberCount: 2 },
      ],
    },
    {
      id: 2025,
      courseId: 2,
      name: '2025',
      people: ['Lotta', 'Bingus'],
      groups: [{ id: 2, name: 'Frontend Team', memberCount: 2 }],
    },
    {
      id: 2026,
      courseId: 3,
      name: '2026',
      people: ['Fnoske', 'Troske'],
      groups: [{ id: 3, name: 'Backend Team', memberCount: 2 }],
    },
  ]);

  courses = this._courses.asReadonly();

  getById(id: number): Course | undefined {
    return this._courses().find((c) => c.id === id);
  }

  getSectionsByCourseId(courseId: number): CourseSection[] {
    return this._courseSections().filter((section) => section.courseId === courseId);
  }

  getSectionById(courseId: number, sectionId: number): CourseSection | undefined {
    return this._courseSections().find(
      (section) => section.courseId === courseId && section.id === sectionId,
    );
  }

  addCourse(name: string): void {
    const nextId = Math.max(0, ...this._courses().map((c) => c.id)) + 1;
    const created = new Date().toISOString().split('T')[0] ?? '';

    this._courses.update((list) => [
      { id: nextId, name, sections: [], people: [], groups: [], created },
      ...list,
    ]);
  }

  addSection(courseId: number, payload: CreateCourseSectionPayload): void {
    const nextSectionId = Math.max(0, ...this._courseSections().map((section) => section.id)) + 1;

    const newSection: CourseSection = {
      id: nextSectionId,
      courseId,
      name: payload.name,
      description: payload.description,
      startDate: payload.startDate,
      endDate: payload.endDate,
      people: [],
      groups: [],
    };

    this._courseSections.update((sections) => [...sections, newSection]);

    this._courses.update((courses) =>
      courses.map((course) => {
        if (course.id !== courseId) {
          return course;
        }

        return {
          ...course,
          sections: [...course.sections, { id: newSection.id, name: newSection.name }],
        };
      }),
    );
  }

  deleteSection(courseId: number, sectionId: number): void {
    this._courseSections.update((sections) =>
      sections.filter((section) => !(section.courseId === courseId && section.id === sectionId)),
    );

    this._courses.update((courses) =>
      courses.map((course) => {
        if (course.id !== courseId) {
          return course;
        }

        return {
          ...course,
          sections: course.sections.filter((section) => section.id !== sectionId),
        };
      }),
    );
  }

  removeGroupFromSection(courseId: number, sectionId: number, groupId: number): void {
    this._courseSections.update((sections) =>
      sections.map((section) => {
        if (section.courseId !== courseId || section.id !== sectionId) {
          return section;
        }

        return {
          ...section,
          groups: section.groups.filter((group) => group.id !== groupId),
        };
      }),
    );
  }
}
