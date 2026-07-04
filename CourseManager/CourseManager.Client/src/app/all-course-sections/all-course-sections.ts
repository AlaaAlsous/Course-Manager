import { Component, signal, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Layout } from '../layout/layout';
import { CourseSectionApiService } from '../api-services/course-section-api-service';
import { CourseSection } from '../api-services/dtos';

interface CourseSectionWithCourseName extends CourseSection {
  courseName: string;
}

@Component({
  selector: 'app-all-course-sections',
  standalone: true,
  imports: [Layout, RouterModule],
  templateUrl: './all-course-sections.html',
})
export class AllCourseSections {
  title = signal('Course Sections');

  private readonly courseSectionApiService = inject(CourseSectionApiService);
  private readonly sectionList = signal<CourseSection[]>([]);

  searchTerm = signal('');

  constructor() {
    void this.loadSections();
  }

  private async loadSections(): Promise<void> {
    const sections = await this.courseSectionApiService.getAllCourseSections();
    this.sectionList.set(sections);
  }

  sections = computed(() =>
    this.sectionList()
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  );

  filteredSections = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.sections();

    return this.sections().filter((s) => s.name.toLowerCase().includes(term));
  });

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  getRelativeDate(dateString: string): string {
    const created = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
