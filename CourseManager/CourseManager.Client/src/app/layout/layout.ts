import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss'],
})
export class Layout {
  @Input() title = '';
}
