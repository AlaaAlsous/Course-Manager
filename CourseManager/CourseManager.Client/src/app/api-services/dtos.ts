export interface Person {
  id: number;
  fullName: string;
}
export interface Course {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
}
export interface CourseSection {
  id: number;
  courseId: number;
  name: string;
  description: string | null;
  createdAt: string;
  startDate: string | null;
  endDate: string | null;
}
export interface Group {
  id: number;
  name: string;
  courseSectionId: number;
}
export interface FileAsset {
  fileAssetId: number;
  fileName: string;
  localPath: string | null;
  cloudPath: string | null;
  storageProvider: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

export interface PersonOverviewFile extends FileAsset {
  sourceType: string;
  sourceId: number;
  sourceName: string;
}

export interface PersonOverview {
  person: Person;
  courses: Course[];
  sections: CourseSection[];
  groups: Group[];
  files: PersonOverviewFile[];
}

export interface PersonRelations {
  courses: any[];
  sections: any[];
  groups: any[];
}
