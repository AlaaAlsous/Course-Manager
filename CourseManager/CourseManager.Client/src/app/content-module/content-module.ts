import { ChangeDetectorRef, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { File as ContentFile, FilePreview } from './file-preview/file-preview';
import { FileApiService } from '../api-services/file-api-services';
import { FileAsset } from '../api-services/dtos';

type ContentTargetType = 'course' | 'course-section' | 'group' | 'person';

interface ContentTarget {
  entityType: ContentTargetType;
  entityId: number;
}

@Component({
  selector: 'app-content-module',
  standalone: true,
  imports: [FilePreview, FormsModule],
  templateUrl: './content-module.html',
  styleUrl: './content-module.scss',
})
export class ContentModule {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('imageInput') imageInputRef!: ElementRef<HTMLInputElement>;
  private readonly router = inject(Router);
  private readonly fileApiService = inject(FileApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  /** The list of files managed by this component. */
  files: ContentFile[] = [];

  /** Returns the download URL for a file (forces browser download). */
  getDownloadUrl(file: ContentFile): string {
    if (file.fileAssetId === undefined) return file.sourceUrl;
    return this.fileApiService.getDownloadUrl(file.fileAssetId);
  }

  /** Bound to the note / comment textarea. */
  noteContent = '';

  /** Whether this device is a mobile device where capture="environment" opens the rear camera. */
  hasCamera = false;

  constructor() {
    void this.loadFiles();
    this.checkCameraAvailability();
  }

  /**
   * Detects if we're on a mobile device where `capture="environment"` will actually
   * open the rear camera. On desktop, `capture` is ignored and the file picker opens,
   * even if a webcam is connected.
   */
  private checkCameraAvailability(): void {
    this.hasCamera = /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent);
  }

  private resolveContentTarget(): ContentTarget | null {
    const urlTree = this.router.parseUrl(this.router.url);
    const segments = (urlTree.root.children['primary']?.segments ?? []).map((segment) =>
      segment.path.toLowerCase(),
    );

    if (segments[0] === 'course' && segments[2] === 'kurstillfalle') {
      const sectionId = Number(segments[3]);
      if (Number.isFinite(sectionId) && sectionId > 0) {
        return { entityType: 'course-section', entityId: sectionId };
      }
      return null;
    }

    if (segments[0] === 'course') {
      const courseId = Number(segments[1]);
      if (Number.isFinite(courseId) && courseId > 0) {
        return { entityType: 'course', entityId: courseId };
      }
      return null;
    }

    if (segments[0] === 'groups') {
      const groupId = Number(segments[1]);
      if (Number.isFinite(groupId) && groupId > 0) {
        return { entityType: 'group', entityId: groupId };
      }
      return null;
    }

    if (segments[0] === 'participant') {
      const personId = Number(urlTree.queryParams['id']);
      if (Number.isFinite(personId) && personId > 0) {
        return { entityType: 'person', entityId: personId };
      }
      return null;
    }

    return null;
  }

  private uploadEntityType(entityType: ContentTargetType): string {
    if (entityType === 'course-section') {
      return 'section';
    }

    return entityType;
  }

  private parseFileName(fileName: string): { name: string; extension: string } {
    const lastDotIndex = fileName.lastIndexOf('.');

    if (lastDotIndex <= 0 || lastDotIndex === fileName.length - 1) {
      return {
        name: fileName,
        extension: 'bin',
      };
    }

    return {
      name: fileName.slice(0, lastDotIndex),
      extension: fileName.slice(lastDotIndex + 1),
    };
  }

  private mapFileAsset(asset: FileAsset): ContentFile {
    const parsedName = this.parseFileName(asset.fileName);

    return {
      fileAssetId: asset.fileAssetId,
      name: parsedName.name,
      extension: parsedName.extension,
      date: new Date(asset.uploadedAt),
      sourceUrl: this.fileApiService.getInlineUrl(asset.fileAssetId),
    };
  }

  private async loadFiles(): Promise<void> {
    const target = this.resolveContentTarget();

    if (!target) {
      this.files = [];
      return;
    }

    let assets: FileAsset[] = [];

    if (target.entityType === 'course') {
      assets = await this.fileApiService.getCourseFiles(target.entityId);
    }

    if (target.entityType === 'course-section') {
      assets = await this.fileApiService.getCourseSectionFiles(target.entityId);
    }

    if (target.entityType === 'group') {
      assets = await this.fileApiService.getGroupFiles(target.entityId);
    }

    if (target.entityType === 'person') {
      assets = await this.fileApiService.getPersonFiles(target.entityId);
    }

    this.files = assets.map((asset) => this.mapFileAsset(asset));
    this.cdr.detectChanges();
  }

  private async uploadFilesToApi(files: FileList): Promise<void> {
    const target = this.resolveContentTarget();

    if (!target) {
      return;
    }

    for (const file of Array.from(files)) {
      await this.fileApiService.uploadFile(
        this.uploadEntityType(target.entityType),
        target.entityId,
        file,
      );
    }

    await this.loadFiles();
  }

  /** Called when the user clicks "Spara" in the note section. */
  async publishNote(): Promise<void> {
    const target = this.resolveContentTarget();
    const text = this.noteContent.trim();

    if (!target || !text) {
      return;
    }

    const noteFile = new window.File([text], `note_${Date.now()}.txt`, {
      type: 'text/plain',
    });

    await this.fileApiService.uploadFile(
      this.uploadEntityType(target.entityType),
      target.entityId,
      noteFile,
    );

    this.noteContent = '';
    await this.loadFiles();
    this.cdr.detectChanges();
  }

  private async deleteFileOnApi(file: ContentFile): Promise<void> {
    const target = this.resolveContentTarget();

    if (!target || !file.fileAssetId) {
      return;
    }

    if (target.entityType === 'course') {
      await this.fileApiService.removeFileFromCourse(target.entityId, file.fileAssetId);
    }

    if (target.entityType === 'course-section') {
      await this.fileApiService.removeFileFromCourseSection(target.entityId, file.fileAssetId);
    }

    if (target.entityType === 'group') {
      await this.fileApiService.removeFileFromGroup(target.entityId, file.fileAssetId);
    }

    if (target.entityType === 'person') {
      await this.fileApiService.removeFileFromPerson(target.entityId, file.fileAssetId);
    }

    await this.loadFiles();
  }

  /** Returns file items sorted by date, most recent first. */
  get sortedFileItems(): ContentFile[] {
    return [...this.files].sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  /** Groups sorted items by date key (yyyy-MM-dd) for visual grouping. */
  get groupedFileItems(): { dateKey: string; items: ContentFile[] }[] {
    const groups = new Map<string, ContentFile[]>();
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

  /** Opens the hidden image picker or camera. */
  triggerImageUpload(): void {
    this.imageInputRef.nativeElement.click();
  }

  /** Called when the user selects files via the file picker. */
  async onFilesSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    await this.uploadFilesToApi(input.files);
    // Reset so the same file can be picked again
    input.value = '';
  }

  /** Called when the user clicks the delete icon on a file. */
  async onDeleteFile(file: ContentFile): Promise<void> {
    await this.deleteFileOnApi(file);
  }
}
