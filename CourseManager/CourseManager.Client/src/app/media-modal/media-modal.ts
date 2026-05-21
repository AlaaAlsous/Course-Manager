import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MediaType } from './media-type';

@Component({
  selector: 'app-media-modal',
  imports: [],
  templateUrl: './media-modal.html',
  styleUrl: './media-modal.scss',
  standalone: true,
})
export default class MediaModal {
  protected readonly MediaType = MediaType;

  /** Whether the modal is currently visible. */
  @Input({ required: true }) isOpen!: boolean;

  /** The type of media to display (Note, Image, or Voice). */
  @Input({ required: true }) mediaType!: MediaType;

  /**
   * The content to display:
   * - For Note: the note text
   * - For Image: the image URL
   * - For Voice: the voice recording URL (placeholder)
   */
  @Input() content: string = '';

  /** Emitted when the user closes the modal. */
  @Output() close = new EventEmitter<void>();

  /** Emitted when the user saves note content. Only relevant for Note type. */
  @Output() save = new EventEmitter<string>();

  onClose() {
    this.close.emit();
  }

  onSave(text: string) {
    this.save.emit(text);
  }
}
