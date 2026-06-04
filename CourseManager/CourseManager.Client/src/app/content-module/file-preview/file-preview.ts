import { Component, input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

export enum PreviewType {
  Text = 'TEXT',
  Image = 'IMAGE',
  Voice = 'VOICE',
  OpenInBrowser = 'OPEN',
  Unknown = 'UNKNOWN',
}

export type File = {
  fileAssetId?: number;
  name: string;
  extension: string;
  date: Date;
  /** URL to the file content on the backend (used for links, img src, etc.). */
  sourceUrl: string;
};

export interface TextSaveEvent {
  fileAssetId: number;
  content: string;
}

/** Known file extension groups for preview differentiation. */
const TEXT_EXTENSIONS = new Set(['txt', 'md', 'csv']);
const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico']);
const VOICE_EXTENSIONS = new Set(['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac', 'wma']);
const OPEN_IN_BROWSER_EXTENSIONS = new Set(['pdf']);

function previewTypeFromExtension(extension: string): PreviewType {
  const ext = extension.toLowerCase();
  if (OPEN_IN_BROWSER_EXTENSIONS.has(ext)) return PreviewType.OpenInBrowser;
  if (IMAGE_EXTENSIONS.has(ext)) return PreviewType.Image;
  if (VOICE_EXTENSIONS.has(ext)) return PreviewType.Voice;
  if (TEXT_EXTENSIONS.has(ext)) return PreviewType.Text;
  return PreviewType.Unknown;
}

@Component({
  selector: 'app-file-preview',
  imports: [],
  templateUrl: './file-preview.html',
  styleUrl: './file-preview.scss',
  standalone: true,
})
export class FilePreview {
  readonly file = input.required<File>();
  readonly isReadonly = input(false);

  constructor(private cdr: ChangeDetectorRef) {}

  /** Emits the text content when the user clicks Save after editing. */
  @Output() textSave = new EventEmitter<TextSaveEvent>();

  /** Text content fetched from the backend for text-type files. */
  textContent = '';

  /** Whether the textarea is in edit mode (false = readonly). */
  isEditing = false;

  /** Whether fetching the text content failed. */
  textLoadFailed = false;

  /** Computed preview type derived from the file extension. */
  get previewType(): PreviewType {
    return previewTypeFromExtension(this.file().extension);
  }

  get hasSourceUrl(): boolean {
    return this.file().sourceUrl.trim().length > 0;
  }

  /** Expose enum so the template can use it in @switch. */
  protected readonly PreviewType = PreviewType;

  async ngOnInit(): Promise<void> {
    if (this.previewType !== PreviewType.Text) return;

    try {
      if (!this.hasSourceUrl) throw new Error('Invalid file URL');
      const response = await fetch(this.file().sourceUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      this.textContent = await response.text();
      this.cdr.detectChanges();
    } catch {
      this.textLoadFailed = true;
      this.cdr.markForCheck();
    }
  }

  toggleEdit(): void {
    if (this.isReadonly()) return;

    if (this.isEditing) {
      const fileAssetId = this.file().fileAssetId;
      if (fileAssetId === undefined) {
        console.error('Cannot save text: fileAssetId is missing');
        this.isEditing = !this.isEditing;
        return;
      }
      this.textSave.emit({ fileAssetId, content: this.textContent });
    }
    this.isEditing = !this.isEditing;
  }
}
