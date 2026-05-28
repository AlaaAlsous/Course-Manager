import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Layout } from '../layout/layout';
import ContentModule from '../content-module/content-module';
import { GroupsService } from '../groups.service';

@Component({
  selector: 'app-group-view',
  imports: [Layout, ContentModule],
  templateUrl: './group-view.html',
  styleUrl: './group-view.scss',
})
export class GroupView {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly groupsService = inject(GroupsService);

  private readonly groupId = Number(this.route.snapshot.paramMap.get('id'));
  private readonly returnCourseId = Number(this.route.snapshot.queryParamMap.get('courseId'));
  private readonly returnSectionId = Number(this.route.snapshot.queryParamMap.get('sectionId'));

  readonly group = computed(() => this.groupsService.getGroupById(this.groupId));
  readonly title = computed(() => this.group()?.name ?? 'Group not found');

  goBack(): void {
    if (this.returnCourseId && this.returnSectionId) {
      this.router.navigate(['/course', this.returnCourseId, 'kurstillfalle', this.returnSectionId]);
      return;
    }

    this.router.navigate(['/home']);
  }
}
