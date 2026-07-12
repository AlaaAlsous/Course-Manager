import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from '../api-services/auth-api-service';
import { SnackbarService, SnackbarType } from '../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
})
export class Login {
  private readonly authService = inject(AuthApiService);
  private readonly router = inject(Router);
  private readonly snackbarService = inject(SnackbarService);

  username = '';
  password = '';
  submitted = false;
  submitting = false;
  isRegisterMode = signal(false);
  displayName = '';

  get isFormValid(): boolean {
    if (this.isRegisterMode()) {
      return (
        this.username.trim().length > 0 &&
        this.password.length >= 6 &&
        this.displayName.trim().length > 0
      );
    }
    return this.username.trim().length > 0 && this.password.length > 0;
  }

  toggleMode(): void {
    this.isRegisterMode.update((v) => !v);
    this.submitted = false;
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;

    if (!this.isFormValid || this.submitting) {
      return;
    }

    this.submitting = true;

    if (this.isRegisterMode()) {
      const result = await this.authService.register(
        this.username.trim(),
        this.password,
        this.displayName.trim(),
      );

      this.submitting = false;

      if (!result.success) {
        this.snackbarService.show(SnackbarType.Failure, result.message ?? 'Registration failed.');
        return;
      }

      this.snackbarService.show(SnackbarType.Success, 'Account created! Welcome.');
      this.router.navigate(['/home']);
    } else {
      const result = await this.authService.login(this.username.trim(), this.password);

      this.submitting = false;

      if (!result.success) {
        this.snackbarService.show(SnackbarType.Failure, result.message ?? 'Login failed.');
        return;
      }

      this.snackbarService.show(SnackbarType.Success, 'Welcome back!');
      this.router.navigate(['/home']);
    }
  }
}
