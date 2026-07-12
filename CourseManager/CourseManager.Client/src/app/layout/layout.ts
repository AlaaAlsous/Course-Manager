import { Component, Input, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ThemeService } from '../theme.service';
import { AuthApiService } from '../api-services/auth-api-service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './layout.html',
})
export class Layout {
  constructor(
    private router: Router,
    public readonly themeService: ThemeService,
  ) {}

  readonly authService = inject(AuthApiService);

  @Input() title = '';

  @Input() breadcrumbs: { label: string; route?: string | (string | number)[]; queryParams?: Record<string, string | number> }[] = [];

  menuOpen = signal(false);

  readonly currentYear = new Date().getFullYear();

  redirectHome() {
    this.router.navigate(['/home'])
  }

  toggleMenu() {
    this.menuOpen.update((v) => !v);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.closeMenu();
  }

  logout() {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/login']);
  }
}
