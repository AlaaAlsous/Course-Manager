import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfirmDialogOptions, ConfirmDialogService } from './confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent implements OnInit, OnDestroy {
  // Controls whether the dialog is rendered.
  protected visible = false;
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
        this.visible = true;
      } else {
        this.visible = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  protected confirm(): void {
    // Resolve the pending request as confirmed.
    this.visible = false;
    this.resolve?.(true);
  }

  protected cancel(): void {
    // Resolve the pending request as cancelled.
    this.visible = false;
    this.resolve?.(false);
  }
}
