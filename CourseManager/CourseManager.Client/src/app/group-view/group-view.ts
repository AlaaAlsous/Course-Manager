import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Layout } from '../layout/layout';
import { ContentModule } from '../content-module/content-module';
import { GroupsService } from '../groups.service';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-group-view',
  imports: [Layout, ContentModule, FormsModule, RouterLink],
  templateUrl: './group-view.html',
  styleUrl: './group-view.scss',
})
export class GroupView {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly groupsService = inject(GroupsService);
  private readonly confirmDialog = inject(ConfirmDialogService);

  private readonly groupId = Number(this.route.snapshot.paramMap.get('id'));
  private readonly returnCourseId = Number(this.route.snapshot.queryParamMap.get('courseId'));
  private readonly returnSectionId = Number(this.route.snapshot.queryParamMap.get('sectionId'));

  newMemberName = '';

  readonly group = computed(() => this.groupsService.getGroupById(this.groupId));
  readonly title = computed(() => this.group()?.name ?? 'Gruppen hittades inte');

  addMember(): void {
    if (!this.group()) {
      return;
    }

    this.groupsService.addMemberToGroup(this.groupId, this.newMemberName);
    this.newMemberName = '';
  }

  async removeMember(memberId: number): Promise<void> {
    if (!this.group()) {
      return;
    }

    const confirmed = await this.confirmDialog.confirm({
      title: 'Ta bort medlem',
      message: 'Vill du verkligen ta bort medlemmen från gruppen?',
      confirmText: 'Ta bort',
      cancelText: 'Avbryt',
    });

    if (!confirmed) {
      return;
    }

    this.groupsService.removeMemberFromGroup(this.groupId, memberId);
  }

  goBack(): void {
    if (this.returnCourseId && this.returnSectionId) {
      this.router.navigate(['/course', this.returnCourseId, 'kurstillfalle', this.returnSectionId]);
      return;
    }

    this.router.navigate(['/home']);
  }
}
