import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { File, FilePreview } from './file-preview/file-preview';

@Component({
  selector: 'app-content-module',
  standalone: true,
  imports: [FilePreview, FormsModule],
  templateUrl: './content-module.html',
  styleUrl: './content-module.scss',
})
export default class ContentModule {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  // TODO: need a required parameter which sets what and where to get files from
  //       i.e. if in a group set to group id?, or base api url?
  //       it all depends on the API service.

  /** The list of files managed by this component. */
  files: File[] = [];

  /** Bound to the "new text file" name input. */
  newTextFileName = '';

  /** Bound to the "new text file" content textarea. */
  newTextFileContent = '';

  /** Whether the create-text-file form is visible. */
  showTextForm = false;

  constructor() {
    this.loadFiles();
  }

  // TODO: Replace with actual API call via shared ApiService.
  //       Expected to fetch all files for the current module from the backend
  //       and set this.files = response.
  private loadFiles(): void {
    this.files = [
      {
        name: 'Course Syllabus',
        extension: 'pdf',
        date: new Date('2026-01-15'),
        sourceUrl: 'https://www.rd.usda.gov/sites/default/files/pdf-sample_0.pdf',
      },
      {
        name: 'Lecture 1 Slides',
        extension: 'pptx',
        date: new Date('2026-02-10'),
        sourceUrl: '/api/files/lecture1.pptx',
      },
      {
        name: 'Homework Assignment 1',
        extension: 'docx',
        date: new Date('2026-03-05'),
        sourceUrl: '',
      },
      {
        name: 'Homework Assignment 2',
        extension: 'docx',
        date: new Date('2026-03-05'),
        sourceUrl: '',
      },
      {
        name: 'Reading List',
        extension: 'pdf',
        date: new Date('2026-03-20'),
        sourceUrl: 'https://www.rd.usda.gov/sites/default/files/pdf-sample_0.pdf',
      },
      {
        name: 'Exam Results',
        extension: 'jpg',
        date: new Date('2026-04-01'),
        sourceUrl:
          'https://d23.com/app/uploads/2011/12/DEC22-a-present-for-donald-TDID1180x600.jpg',
      },
      {
        name: 'Notes',
        extension: 'txt',
        date: new Date('2026-04-01'),
        sourceUrl: '',
      },
      {
        name: 'VoiceNotes',
        extension: 'mp3',
        date: new Date('2026-04-01'),
        sourceUrl: '/api/files/notes.txt',
      },
    ];
  }

  // TODO: Replace with actual API call via shared ApiService.
  //       Upload the selected files to the backend, then call loadFiles() to refresh.
  private uploadFilesToApi(files: FileList): void {
    console.log('Upload files:', files);
  }

  // TODO: Replace with actual API call via shared ApiService.
  //       Send the new text file to the backend, then call loadFiles() to refresh.
  private createTextFileOnApi(name: string, extension: string, content: string): void {
    console.log('Create text file:', { name, extension, content });
  }

  // TODO: Replace with actual API call via shared ApiService.
  //       Delete the file on the backend, then call loadFiles() to refresh.
  private deleteFileOnApi(file: File): void {
    console.log('Delete file:', file.name);
  }

  /** Returns file items sorted by date, most recent first. */
  get sortedFileItems(): File[] {
    return [...this.files].sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  /** Groups sorted items by date key (yyyy-MM-dd) for visual grouping. */
  get groupedFileItems(): { dateKey: string; items: File[] }[] {
    const groups = new Map<string, File[]>();
    for (const item of this.sortedFileItems) {
      const key = item.date.toISOString().split('T')[0];
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(item);
    }
    return Array.from(groups.entries()).map(([dateKey, items]) => ({ dateKey, items }));
  }

  /** Opens the hidden file picker. */
  triggerFileUpload(): void {
    this.fileInputRef.nativeElement.click();
  }

  /** Called when the user selects files via the file picker. */
  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.uploadFilesToApi(input.files);
    // Reset so the same file can be picked again
    input.value = '';
  }

  /** Called when the user submits a new text file. */
  onCreateTextFile(): void {
    if (!this.newTextFileName.trim()) return;

    this.createTextFileOnApi(this.newTextFileName.trim(), 'txt', this.newTextFileContent);

    this.newTextFileName = '';
    this.newTextFileContent = '';
    this.showTextForm = false;
  }

  /** Called when the user clicks the delete icon on a file. */
  onDeleteFile(file: File): void {
    this.deleteFileOnApi(file);
  }
}
