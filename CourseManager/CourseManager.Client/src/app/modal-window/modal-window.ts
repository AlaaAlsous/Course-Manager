import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal-window',
  imports: [],
  template: `
  @if (isOpen) {
    <div class="modal-base" (click)="close();">
      <div class="modal-base-content" (click)="$event.stopPropagation()">
        <ng-content/>
      </div>
    </div>
  }
    `,
  styleUrl: './modal-window.scss',
})

/**
 * Modal window class
 *
 * @example
 * <button (click)="modal.open()">Modal button</button>
 * <app-modal-window #modal>
 *     <p>modal-window works!</p>
 * </app-modal-window>
 */
export class ModalWindow {
  private _isOpen = false;

  get isOpen(): boolean {
    return this._isOpen;
  }

  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @Output() toggled = new EventEmitter<void>();

  open() {
    if (!this._isOpen) {
      this.opened.emit();
      this.toggled.emit();
    }
    this._isOpen = true;
  }

  close() {
    if (this._isOpen) {
      this.closed.emit();
      this.toggled.emit();
    }
    this._isOpen = false;
  }

  toggle() {
    this._isOpen ? this.close() : this.open();
  }
}
