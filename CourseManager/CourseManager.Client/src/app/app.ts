import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { Snackbar } from './shared/snackbar/snackbar';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ConfirmDialogComponent, Snackbar],
  templateUrl: './app.html',
})
export class App {
  constructor(private readonly themeService: ThemeService) {}
}
