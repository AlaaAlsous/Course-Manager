export interface CourseSectionSummary {
  id: number;
  name: string;
}

export interface CourseSectionGroup {
  id: number;
  name: string;
  memberCount: number;
}

export interface CourseSection {
  id: number;
  courseId: number;
  name: string;
  people: string[];
  groups: CourseSectionGroup[];
}

export interface Course {
  id: number;
  name: string;
  sections: CourseSectionSummary[];
  people: string[];
  groups: string[];
  created: string;
}
