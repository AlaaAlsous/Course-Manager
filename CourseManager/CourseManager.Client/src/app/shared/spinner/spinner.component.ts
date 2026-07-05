import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `
    <div class="spinner" [class.spinner--overlay]="overlay" [attr.aria-label]="label">
      <span class="spinner__dot"></span>
      <span class="spinner__dot"></span>
      <span class="spinner__dot"></span>
    </div>
  `,
  styles: `
    .spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 6px;
      padding: var(--space-2xl) var(--space-md);
    }
    .spinner--overlay {
      padding: 0;
      min-height: 200px;
    }
    .spinner__dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--color-primary);
      animation: spinner-bounce 1.2s infinite ease-in-out both;
    }
    .spinner__dot:nth-child(1) { animation-delay: -0.32s; }
    .spinner__dot:nth-child(2) { animation-delay: -0.16s; }
    .spinner__dot:nth-child(3) { animation-delay: 0s; }

    @keyframes spinner-bounce {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40% { transform: scale(1); opacity: 1; }
    }
  `,
})
export class SpinnerComponent {
  @Input() overlay = false;
  @Input() label = 'Loading...';
}
