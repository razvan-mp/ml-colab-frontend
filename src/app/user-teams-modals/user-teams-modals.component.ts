import {Component} from '@angular/core';
import {MessageService} from "primeng/api";
import {StateManagerService} from "../services/state-manager.service";
import {FriendsService} from "../services/friends.service";
import {User} from "../models/User";
import {TeamsService} from "../services/teams.service";
import {catchError} from "rxjs/operators";

@Component({
  selector: 'app-user-teams-modals',
  templateUrl: './user-teams-modals.component.html',
  styleUrls: ['./user-teams-modals.component.scss']
})
export class UserTeamsModalsComponent {
  selectedUsers: User[] = [];
  displayItem: number = 0;

  constructor(
    private messageService: MessageService,
    private friendsService: FriendsService,
    private teamsService: TeamsService,
    private state: StateManagerService,
  ) {
  }

  get selectedTeamDescription() {
    return this.state.selectedTeamDescription;
  }

  set selectedTeamDescription(value: any) {
    this.state.selectedTeamDescription = value;
  }

  get selectedTeamName() {
    return this.state.selectedTeamName;
  }

  set selectedTeamName(value: string) {
    this.state.selectedTeamName = value;
  }

  get selectedTeam() {
    return this.state.selectedTeam;
  }

  set selectedTeam(value: number) {
    this.state.selectedTeam = value;
  }

  get displayManageTeamModal() {
    return this.state.displayManageTeamModal;
  }

  set displayManageTeamModal(value: boolean) {
    this.state.displayManageTeamModal = value;
  }

  get friends() {
    return this.state.friends;
  }

  set displaySidebar(value: boolean) {
    this.state.displaySidebar = value;
  }

  get displayCreateTeamModal() {
    return this.state.displayCreateTeamModal;
  }

  set displayCreateTeamModal(value: boolean) {
    this.state.displayCreateTeamModal = value;
  }

  setDisplayItem(value: number): void {
    this.displayItem = value;
  }

  createTeam($event: SubmitEvent, form: HTMLFormElement): void {
    let payload = Object.fromEntries(new FormData(form as any) as any);
    payload["users"] = this.selectedUsers;
    this.teamsService.createTeam(payload)
      .pipe(
        catchError(error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: "Team creation failed. Please try again.",
          });
          return error;
        })
      )
      .subscribe(() => {
        this.hideCreateTeamModal();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: "Team created successfully.",
        });
      });
  }

  updateTeamDetails($event: SubmitEvent, form: HTMLFormElement): void {
    $event.preventDefault();
    const formData = Object.fromEntries(new FormData(form as any) as any);
    const payload = {
      name: formData["name"],
      description: formData["description"],
      id: this.selectedTeam,
    };
    this.teamsService.updateTeam(payload)
      .pipe(catchError(error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: "Team update failed. Please try again.",
        });
        return error;
      }))
      .subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: "Team updated successfully.",
        });
        this.selectedTeamName = formData["name"];
        this.selectedTeamDescription = formData["description"];
      });
  }

  deleteTeam($event: SubmitEvent, form: HTMLFormElement): void {
    $event.preventDefault();
    const formData = Object.fromEntries(new FormData(form as any) as any);

    if (formData["password"] === "") {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: "Please enter your password.",
      });
      return;
    }

    const payload = {
      name: formData["name"],
      password: formData["password"],
      id: this.selectedTeam,
    };
    
    this.teamsService.deleteTeam(payload)
      .pipe(catchError(error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: "Team deletion failed. Please try again.",
        });
        return error;
      }))
      .subscribe(res => {
        if (res["detail"] !== "Team deleted successfully.") {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: res["detail"],
          });
        } else {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: "Team deleted successfully.",
          });
          this.hideManageTeamModal();
        }
      });
  }

  hideCreateTeamModal(): void {
    this.selectedUsers = [];
    this.displayCreateTeamModal = false;
    this.displaySidebar = true;
  }

  hideManageTeamModal(): void {
    this.selectedTeam = -1;
    this.selectedTeamDescription = '';
    this.selectedTeamName = '';
    this.displayManageTeamModal = false;
    this.displaySidebar = true;
  }

  resetTeamDetailForm() {
    const teamNameElement = document.getElementById('manage-team-name') as HTMLInputElement;
    const teamDescriptionElement = document.getElementById('manage-team-description') as HTMLInputElement;
    teamNameElement.value = this.selectedTeamName;
    teamDescriptionElement.value = this.selectedTeamDescription;
  }
}
