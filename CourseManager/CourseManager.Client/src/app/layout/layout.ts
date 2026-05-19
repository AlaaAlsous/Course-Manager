import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss'],
})
export class Layout {
  @Input() title = '';
}
