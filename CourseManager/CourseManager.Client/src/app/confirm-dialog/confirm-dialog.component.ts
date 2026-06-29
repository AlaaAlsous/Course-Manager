import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfirmDialogOptions, ConfirmDialogService } from './confirm-dialog.service';
import { ModalWindow } from '../modal-window/modal-window';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [ModalWindow],
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent implements OnInit, OnDestroy {
  @ViewChild(ModalWindow) modal!: ModalWindow;

  // Holds the currently requested dialog content and labels.
  protected options: ConfirmDialogOptions = { message: '' };

  // Resolver for the active confirmation request promise.
  private resolve?: (confirmed: boolean) => void;
  private sub?: Subscription;

  constructor(private readonly confirmDialogService: ConfirmDialogService) {}

  ngOnInit(): void {
    // Listen for open/close requests from the global dialog service.
    this.sub = this.confirmDialogService.dialogRequest$.subscribe((req) => {
      if (req) {
        this.options = req.options;
        this.resolve = req.resolve;
        this.modal.open();
      } else {
        this.modal.close();
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  protected confirm(): void {
    // Guard: save + clear resolve so re-entrant cancel() via (closed) binding is no-op.
    const resolve = this.resolve;
    this.resolve = undefined;
    this.modal.close();
    resolve?.(true);
  }

  protected cancel(): void {
    // Guard: save + clear resolve so re-entrant cancel() via (closed) binding is no-op.
    const resolve = this.resolve;
    this.resolve = undefined;
    this.modal.close();
    resolve?.(false);
  }
}
