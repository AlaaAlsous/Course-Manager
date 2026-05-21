import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface CreateCoursePayload {
  name: string;
  description: string;
}

@Component({
  selector: 'app-create-course-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-course-modal.html',
  styleUrl: './create-course-modal.scss',
})
export class CreateCourseModal {
  // Notifies parent (Home) to close the modal.
  @Output() close = new EventEmitter<void>();
  // Sends new course data back to parent when the form is valid.
  @Output() createCourse = new EventEmitter<CreateCoursePayload>();

  name = '';
  description = '';
  submitted = false;

  // Simple required-field validation for Name + Description.
  get isFormValid(): boolean {
    return this.name.trim().length > 0 && this.description.trim().length > 0;
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    // Enables validation message display after first submit attempt.
    this.submitted = true;

    if (!this.isFormValid) {
      return;
    }

    this.createCourse.emit({
      name: this.name.trim(),
      description: this.description.trim(),
    });
  }
}
