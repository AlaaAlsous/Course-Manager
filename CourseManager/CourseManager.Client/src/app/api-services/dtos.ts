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
