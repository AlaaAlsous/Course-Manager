import { Component, inject } from '@angular/core';

import {
  SnackbarService,
  SnackbarType
} from './snackbar.service';

@Component({
  selector: 'app-snackbar',
  imports: [],
  templateUrl: './snackbar.html',
})
export class Snackbar {

  snackbar = inject(SnackbarService);

  SnackbarType = SnackbarType;

}
