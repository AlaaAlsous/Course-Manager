export interface Note {
  id: number;
  text: string;
  createdAt: string;

}

export interface Person {
  id: number;
  name: string;
  email: string;
  phone: string;
  imageUrl: string;
  courses: string[];
    notes: Note[];
}