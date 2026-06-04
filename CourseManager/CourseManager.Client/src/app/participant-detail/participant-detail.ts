import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Layout } from '../layout/layout';
import { ContentModule } from '../content-module/content-module';
import { PersonApiService } from '../api-services/person-api-service';
import { File as ContentFile, FilePreview } from '../content-module/file-preview/file-preview';
import { FileApiService } from '../api-services/file-api-services';
import { CourseSection, Group, PersonOverview, PersonOverviewFile } from '../api-services/dtos';

interface OverviewContentFile extends ContentFile {
  sourceType: string;
  sourceName: string;
}

@Component({
  selector: 'app-participant-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Layout, ContentModule, FilePreview],
  templateUrl: './participant-detail.html',
  styleUrls: ['./participant-detail.scss'],
})
export class ParticipantDetail implements OnInit {
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly personApiService = inject(PersonApiService);
  private readonly fileApiService = inject(FileApiService);

  title = signal('Detaljer för deltagare');
  loading = signal(true);
  errorMessage = signal<string | null>(null);
  overview = signal<PersonOverview | null>(null);
  personId = signal<number | null>(null);
  isEditing = signal(false);
  editName = '';

  overviewFiles = computed(() => this.overview()?.files.map((file) => this.mapOverviewFile(file)) ?? []);

  constructor(private route: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.queryParamMap.get('id'));
    if (!Number.isFinite(id) || id <= 0) {
      this.loading.set(false);
      this.errorMessage.set('Deltagaren kunde inte hittas eftersom länken saknar ett giltigt id.');
      return;
    }

    this.personId.set(id);
    await this.loadOverview(id);
  }

  private async loadOverview(id: number): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set(null);

    const overview = await this.personApiService.getPersonOverview(id);
    if (!overview) {
      this.overview.set(null);
      this.title.set('Deltagaren hittades inte');
      this.errorMessage.set('Deltagaren hittades inte eller kunde inte laddas.');
      this.loading.set(false);
      return;
    }

    this.overview.set(overview);
    this.title.set(overview.person.fullName);
    this.loading.set(false);
  }

  private mapOverviewFile(file: PersonOverviewFile): OverviewContentFile {
    const parsedName = this.parseFileName(file.fileName);

    return {
      fileAssetId: file.fileAssetId,
      name: parsedName.name,
      extension: parsedName.extension,
      date: new Date(file.uploadedAt),
      sourceUrl: this.fileApiService.getInlineUrl(file.fileAssetId),
      sourceType: file.sourceType,
      sourceName: file.sourceName,
    };
  }

  private parseFileName(fileName: string): { name: string; extension: string } {
    const lastDotIndex = fileName.lastIndexOf('.');

    if (lastDotIndex <= 0 || lastDotIndex === fileName.length - 1) {
      return { name: fileName, extension: 'bin' };
    }

    return {
      name: fileName.slice(0, lastDotIndex),
      extension: fileName.slice(lastDotIndex + 1),
    };
  }

  startEdit(): void {
    this.editName = this.overview()?.person.fullName ?? '';
    this.isEditing.set(true);
  }

  async saveEdit(): Promise<void> {
    const id = this.personId();
    const name = this.editName.trim();
    if (!id || !name) {
      return;
    }

    const updated = await this.personApiService.updatePerson(id, name);
    if (!updated) {
      this.errorMessage.set('Kunde inte uppdatera deltagaren.');
      return;
    }

    await this.loadOverview(id);
    this.isEditing.set(false);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }

  courseNameForSection(section: CourseSection): string {
    return this.overview()?.courses.find((course) => course.id === section.courseId)?.name ?? 'Okänt program';
  }

  sectionNameForGroup(group: Group): string {
    return this.overview()?.sections.find((section) => section.id === group.courseSectionId)?.name ?? 'Okänt kurstillfälle';
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return 'Datum saknas';

    return new Intl.DateTimeFormat('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
      return;
    }

    this.router.navigate(['/participants']);
  }
}
