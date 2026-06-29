import { Injectable, signal } from '@angular/core';

export enum SnackbarType {
  Info,
  Success,
  Failure,
}

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  message = signal('');
  visible = signal(false);

  type = signal<SnackbarType>(SnackbarType.Info);

  private hideTimeout: ReturnType<typeof setTimeout> | null = null;

  show(type: SnackbarType, message: string, duration = 3000) {
    if (this.hideTimeout !== null) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    this.type.set(type);
    this.message.set(message);
    this.visible.set(true);

    this.hideTimeout = setTimeout(() => {
      this.visible.set(false);
      this.hideTimeout = null;
    }, duration);
  }

  hide() {
    if (this.hideTimeout !== null) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
    this.visible.set(false);
  }
}
