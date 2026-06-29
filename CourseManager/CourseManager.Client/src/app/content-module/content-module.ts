import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { File as ContentFile, FilePreview, TextSaveEvent } from './file-preview/file-preview';
import { FileApiService } from '../api-services/file-api-services';
import { FileAsset, PersonOverviewFile } from '../api-services/dtos';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';

type ContentTargetType = 'course' | 'course-section' | 'group' | 'person';

interface ContentTarget {
  entityType: ContentTargetType;
  entityId: number;
}

interface OverviewFileGroup {
  sourceType: string;
  sourceTypeLabel: string;
  sourceName: string;
  items: ContentFile[];
}

const SOURCE_TYPE_LABELS: Record<string, string> = {
  course: 'Course',
  'course-section': 'Course Section',
  group: 'Group',
  person: 'Person',
};

function parseFileName(fileName: string): { name: string; extension: string } {
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

@Component({
  selector: 'app-content-module',
  standalone: true,
  imports: [FilePreview, FormsModule],
  templateUrl: './content-module.html',
})
export class ContentModule {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('imageInput') imageInputRef!: ElementRef<HTMLInputElement>;

  private readonly router = inject(Router);
  private readonly fileApiService = inject(FileApiService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly cdr = inject(ChangeDetectorRef);

  // ---- Inputs & Outputs ----

  /**
   * When viewing a person, the parent component can supply the full
   * PersonOverview files so the user can choose to view everything the
   * person is connected to, categorised by source.
   */
  readonly overviewFiles = input<PersonOverviewFile[]>([]);

  /**
   * Emitted whenever a file is uploaded or note published so the parent
   * can refresh the overview data.
   */
  @Output() readonly contentChanged = new EventEmitter<void>();

  // ---- Signals ----

  /** The list of files managed by this component. */
  files: ContentFile[] = [];

  /** Toggle between direct files and the overview (categorised) view. */
  readonly showOverview = signal(false);

  /** Whether overview files are available (i.e. parent provided them). */
  readonly hasOverview = computed(() => this.overviewFiles().length > 0);

  /**
   * Overview files grouped by their origin (sourceType + sourceName).
   * Only populated when showOverview() is true.
   */
  readonly overviewFileGroups = computed<OverviewFileGroup[]>(() => {
    if (!this.showOverview()) {
      return [];
    }

    const groups = new Map<string, OverviewFileGroup>();

    for (const file of this.overviewFiles()) {
      // Use a composite key so entities with the same name but different types don't merge.
      const key = `${file.sourceType}|${file.sourceId}`;

      if (!groups.has(key)) {
        groups.set(key, {
          sourceType: file.sourceType,
          sourceTypeLabel: SOURCE_TYPE_LABELS[file.sourceType] ?? file.sourceType,
          sourceName: file.sourceName,
          items: [],
        });
      }

      const parsed = parseFileName(file.fileName);
      groups.get(key)!.items.push({
        fileAssetId: file.fileAssetId,
        name: parsed.name,
        extension: parsed.extension,
        date: new Date(file.uploadedAt),
        sourceUrl: this.fileApiService.getInlineUrl(file.fileAssetId),
      });
    }

    return Array.from(groups.values()).sort((a, b) => {
      const order: Record<string, number> = {
        Course: 0,
        'Course Section': 1,
        Group: 2,
        Person: 3,
      };
      return (order[a.sourceType] ?? 99) - (order[b.sourceType] ?? 99);
    });
  });

  /** Toggle between the two views. */
  toggleOverview(): void {
    this.showOverview.update((v) => !v);
    this.cdr.detectChanges();
  }

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

    if (segments[0] === 'course' && segments[2] === 'course-section') {
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

  private mapFileAsset(asset: FileAsset): ContentFile {
    const parsedName = parseFileName(asset.fileName);

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
    this.contentChanged.emit();
    this.cdr.detectChanges();
  }

  private async deleteFileOnApi(file: ContentFile): Promise<void> {
    if (!file.fileAssetId) {
      return;
    }

    await this.fileApiService.deleteFile(file.fileAssetId);
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
    this.contentChanged.emit();
    // Reset so the same file can be picked again
    input.value = '';
  }

  /** Called when the user clicks the delete icon on a file. */
  async onDeleteFile(file: ContentFile): Promise<void> {
    const confirmed = await this.confirmDialog.confirm({
      title: 'Delete file',
      message: 'Are you sure you want to delete ' + file.name + '?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      await this.deleteFileOnApi(file);
      this.contentChanged.emit();
    }
  }

  /** Called when the user clicks Save after editing a text file. */
  async onTextSave(event: TextSaveEvent): Promise<void> {
    await this.fileApiService.updateFileContent(event.fileAssetId, event.content);
    await this.loadFiles();
    this.contentChanged.emit();
  }
}
