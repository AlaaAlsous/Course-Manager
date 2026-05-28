import { Component, input, Output, EventEmitter } from '@angular/core';
import MediaModal from '../media-modal/media-modal';
import { MediaType } from '../media-modal/media-type';

@Component({
  selector: 'app-content-module',
  standalone: true,
  imports: [MediaModal],
  templateUrl: './content-module.html',
  styleUrl: './content-module.scss',
})
/**
 * Collapsible content panel with Notes, Images, and Voice Recordings sections.
 *
 * Clicking a note/image/voice item opens the MediaModal with that item's content.
 *
 * @example
 * ```html
 * <app-content-module
 *   [(noteText)]="myNote"
 *   [imageItems]="['Image A', 'Image B']"
 *   (imageItemClick)="onImageClick($event)"
 * />
 * ```
 */
export default class ContentModule {
  /** Items shown as clickable links below the note textarea. */
  readonly noteItems = input<string[]>(['Notering 1', 'Notering 2']);

  /** Note textarea content. Supports two-way binding via `[(noteText)]`. */
  readonly noteText = input<string>('');

  /** Items shown as clickable links in the Images section. */
  readonly imageItems = input<string[]>(['Bild 1', 'Bild 2', 'Bild 3']);

  /** Items shown as clickable links in the Voice Recordings section. */
  readonly voiceItems = input<string[]>(['Röstinspelning 1', 'Röstinspelning 2', 'Röstinspelning 3']);

  /** Emits the clicked item string when a note link is clicked. */
  @Output() noteItemClick = new EventEmitter<string>();

  /** Emits the textarea value on every keystroke. Pairs with `noteText` for `[(noteText)]`. */
  @Output() noteTextChange = new EventEmitter<string>();

  /** Emits the clicked item string when an image link is clicked. */
  @Output() imageItemClick = new EventEmitter<string>();

  /** Emits the clicked item string when a voice link is clicked. */
  @Output() voiceItemClick = new EventEmitter<string>();

  isNotesCollapsed = true;
  isNoteFullscreen = false;

  isImagesCollapsed = true;
  isVRCollapsed = true;

  // Internal modal state
  readonly MediaType = MediaType;

  isModalOpen = false;
  modalMediaType: MediaType = MediaType.Note;
  modalContent = '';

  toggleCollapse(sectionNumber: number) {
    switch (sectionNumber) {
      case 1:
        this.isNotesCollapsed = !this.isNotesCollapsed;
        break;
      case 2:
        this.isImagesCollapsed = !this.isImagesCollapsed;
        break;
      case 3:
        this.isVRCollapsed = !this.isVRCollapsed;
        break;
    }
  }

  toggleNoteFullscreen() {
    this.isNoteFullscreen = !this.isNoteFullscreen;
  }

  onNoteInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.noteTextChange.emit(textarea.value);
  }

  // Modal openers

  onNoteItemClick(item: string) {
    this.noteItemClick.emit(item);
    this.modalMediaType = MediaType.Note;
    this.modalContent = item;
    this.isModalOpen = true;
  }

  onImageItemClick(item: string) {
    this.imageItemClick.emit(item);
    this.modalMediaType = MediaType.Image;
    this.modalContent = item;
    this.isModalOpen = true;
  }

  onVoiceItemClick(item: string) {
    this.voiceItemClick.emit(item);
    this.modalMediaType = MediaType.Voice;
    this.modalContent = item;
    this.isModalOpen = true;
  }

  onModalClose() {
    this.isModalOpen = false;
  }

  onModalSave(text: string) {
    // For now, just close. The parent can also listen to noteTextChange.
    this.modalContent = text;
    this.isModalOpen = false;
  }
}
