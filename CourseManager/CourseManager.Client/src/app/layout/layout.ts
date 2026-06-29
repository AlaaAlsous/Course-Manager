import { Component, Input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ThemeService } from '../theme.service';

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

  @Input() title = '';

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
}
