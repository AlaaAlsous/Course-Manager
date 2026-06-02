import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Layout } from '../layout/layout';
import ContentModule from '../content-module/content-module';
import { PersonApiService } from '../api-services/person-api-service';

@Component({
  selector: 'app-participant-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, Layout, ContentModule],
  templateUrl: './participant-detail.html',
  styleUrls: ['./participant-detail.scss'],
})
export class ParticipantDetail implements OnInit {
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly personApiService = inject(PersonApiService);

  title = signal('Detaljer för deltagare');

  selectedPerson: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.queryParamMap.get('id'));
    this.personApiService.getPersonById(id).then(person => {
      this.selectedPerson = person;
      if (person) {
        this.title.set(person.fullName);
      }
    });
  }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
      return;
    }

    this.router.navigate(['/participants']);
  }
}
