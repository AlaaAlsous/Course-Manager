import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss'],
})
export class Layout {
  @Input() title = '';
}
