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

  constructor(
    private messageService: MessageService,
    private friendsService: FriendsService,
    private teamsService: TeamsService,
    private state: StateManagerService,
  ) {
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

  hideCreateTeamModal(): void {
    this.displayCreateTeamModal = false;
    this.displaySidebar = true;
  }
}
