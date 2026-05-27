import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ConfirmDialogOptions {
  /** The message shown to the user inside the dialog. */
  message: string;
  /** Optional title shown above the message. */
  title?: string;
  /** Label for the confirm button. Defaults to "Confirm". */
  confirmText?: string;
  /** Label for the cancel button. Defaults to "Cancel". */
  cancelText?: string;
}

/** @internal – used by ConfirmDialogComponent only */
export interface ConfirmDialogRequest {
  options: ConfirmDialogOptions;
  resolve: (confirmed: boolean) => void;
}

/**
 * Global service for showing a confirmation dialog.
 *
 * Usage (inject anywhere):
 * ```ts
 * const confirmed = await this.confirmDialog.confirm({
 *   message: 'Are you sure you want to delete this item?',
 *   confirmText: 'Delete',
 * });
 * if (confirmed) { ... }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  private readonly request$ = new Subject<ConfirmDialogRequest | null>();

  /** Observable consumed by ConfirmDialogComponent – do not use directly. */
  readonly dialogRequest$ = this.request$.asObservable();

  /**
   * Opens the confirmation dialog with the given options.
   * Returns a Promise that resolves to `true` if the user confirmed,
   * or `false` if the user cancelled (or dismissed the overlay).
   */
  confirm(options: ConfirmDialogOptions): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.request$.next({ options, resolve });
    });
  }

  /** @internal – called by ConfirmDialogComponent after the user responds. */
  close(): void {
    this.request$.next(null);
  }
}