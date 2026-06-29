import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Layout } from '../layout/layout';
import { ContentModule } from '../content-module/content-module';
import { GroupApiService } from '../api-services/group-api-service';
import { CourseApiService } from '../api-services/course-api-service';
import { CourseSectionApiService } from '../api-services/course-section-api-service';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { PersonApiService } from '../api-services/person-api-service';
import { SnackbarService, SnackbarType } from '../shared/snackbar/snackbar.service';

interface GroupMemberViewModel {
  id: number;
  name: string;
}

interface GroupViewModel {
  id: number;
  name: string;
  courseSectionId: number;
  members: GroupMemberViewModel[];
}

@Component({
  selector: 'app-group-view',
  imports: [Layout, ContentModule, FormsModule, RouterLink],
  templateUrl: './group-view.html',
})
export class GroupView {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly groupApiService = inject(GroupApiService);
  private readonly courseApiService = inject(CourseApiService);
  private readonly courseSectionApiService = inject(CourseSectionApiService);
  private readonly personApiService = inject(PersonApiService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly snackbarService = inject(SnackbarService);

  private readonly groupId = Number(this.route.snapshot.paramMap.get('id'));
  private readonly returnCourseId = Number(this.route.snapshot.queryParamMap.get('courseId'));
  private readonly returnSectionId = Number(this.route.snapshot.queryParamMap.get('sectionId'));

  newMemberName = '';
  isEditing = signal(false);
  editName = '';
  readonly group = signal<GroupViewModel | null>(null);

  readonly title = computed(() => this.group()?.name ?? 'Group not found');

  courseName = signal('');
  sectionName = signal('');

  breadcrumbs = computed(() => {
    if (this.returnCourseId && this.returnSectionId) {
      return [
        { label: this.courseName() || 'Course', route: `/course/${this.returnCourseId}` },
        { label: this.sectionName() || 'Section', route: `/course/${this.returnCourseId}/course-section/${this.returnSectionId}` },
        { label: this.title() },
      ];
    }
    return [{ label: this.title() }];
  });

  constructor() {
    void this.loadGroupData();
    void this.loadBreadcrumbNames();
  }

  private async loadBreadcrumbNames(): Promise<void> {
    if (this.returnCourseId) {
      const course = await this.courseApiService.getCourseById(this.returnCourseId);
      if (course) this.courseName.set(course.name);
    }
    if (this.returnSectionId) {
      const section = await this.courseSectionApiService.getCourseSectionById(this.returnSectionId);
      if (section) this.sectionName.set(section.name);
    }
  }

  private async loadGroupData(): Promise<void> {
    const group = await this.groupApiService.getGroupById(this.groupId);

    if (!group) {
      this.group.set(null);
      return;
    }

    const members = await this.groupApiService.getAllPeople(this.groupId);
    this.group.set({
      ...group,
      members: members.map((member) => ({
        id: member.id,
        name: member.fullName,
      })),
    });
  }

  async addMember(): Promise<void> {
    const selectedGroup = this.group();
    const memberName = this.newMemberName.trim();

    if (!selectedGroup || !memberName) {
      this.snackbarService.show(SnackbarType.Failure, 'Please enter a name for the member.');
      return;
    }

    const allPeople = await this.personApiService.getAllPersons();
    const existingPerson = allPeople.find(
      (person) => person.fullName.toLowerCase() === memberName.toLowerCase(),
    );

    let relationAdded = false;

    if (existingPerson) {
      relationAdded = await this.groupApiService.addPerson(this.groupId, existingPerson.id);
    } else {
      const createdPersonId = await this.personApiService.createPerson(memberName);

      if (!createdPersonId) {
        this.snackbarService.show(SnackbarType.Failure, 'Could not create participant.');
        return;
      }

      relationAdded = await this.groupApiService.addPerson(this.groupId, createdPersonId);
      await this.personApiService.getPersonById(createdPersonId);
    }

    if (!relationAdded) {
      this.snackbarService.show(SnackbarType.Failure, 'Could not add member to group.');
      return;
    }

    await this.loadGroupData();
    this.newMemberName = '';
    this.snackbarService.show(SnackbarType.Success, 'Member added.');
  }

  async removeMember(memberId: number): Promise<void> {
    if (!this.group()) {
      return;
    }

    const confirmed = await this.confirmDialog.confirm({
      title: 'Remove Member',
      message: 'Are you sure you want to remove the member from the group?',
      confirmText: 'Remove',
      cancelText: 'Cancel',
    });

    if (!confirmed) {
      return;
    }

    const removed = await this.groupApiService.deletePerson(this.groupId, memberId);

    if (!removed) {
      this.snackbarService.show(SnackbarType.Failure, 'Could not remove member.');
      return;
    }

    await this.loadGroupData();
    this.snackbarService.show(SnackbarType.Success, 'Member removed.');
  }

  async deleteGroup(): Promise<void> {
    const selectedGroup = this.group();
    if (!selectedGroup) {
      return;
    }

    const confirmed = await this.confirmDialog.confirm({
      title: 'Delete Group',
      message: 'Are you sure you want to delete this group?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (!confirmed) {
      return;
    }

    const deleted = await this.groupApiService.deleteGroup(selectedGroup.id);

    if (!deleted) {
      this.snackbarService.show(SnackbarType.Failure, 'Could not delete group.');
      return;
    }

    this.snackbarService.show(SnackbarType.Success, 'Group deleted.');
    this.goBack();
  }

  startEdit(): void {
    this.editName = this.group()?.name ?? '';
    this.isEditing.set(true);
  }

  async saveEdit(): Promise<void> {
    await this.groupApiService.updateGroup(this.groupId, this.editName);
    await this.loadGroupData();
    this.isEditing.set(false);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }

  goBack(): void {
    if (this.returnCourseId && this.returnSectionId) {
      this.router.navigate(['/course', this.returnCourseId, 'course-section', this.returnSectionId]);
      return;
    }

    this.router.navigate(['/home']);
  }
}
