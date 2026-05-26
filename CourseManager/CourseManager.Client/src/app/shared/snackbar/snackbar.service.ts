import { Injectable, signal } from '@angular/core';

export enum SnackbarType {
  Info,
  Success,
  Failure
}

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  message = signal('');
  visible = signal(false);

  type = signal<SnackbarType>(
    SnackbarType.Info
  );

  show(
    type: SnackbarType,
    message: string,
    duration = 3000
  ) {

    console.log('SHOW RUNNING');

    this.type.set(type);

    this.message.set(message);

    this.visible.set(true);

    console.log('VISIBLE:', this.visible());
    console.log('MESSAGE:', this.message());

    setTimeout(() => {
      this.visible.set(false);
    }, duration);

  }
}