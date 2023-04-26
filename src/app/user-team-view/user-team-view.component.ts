import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { StateManagerService } from '../services/state-manager.service';
import { NoteService } from '../services/note.service';
import { User } from '../models/User';

@Component({
  selector: 'app-user-team-view',
  providers: [MessageService],
  templateUrl: './user-team-view.component.html',
  styleUrls: ['./user-team-view.component.scss'],
})
export class UserTeamViewComponent {
  constructor(
    private messageService: MessageService,
    private state: StateManagerService,
    private noteService: NoteService
  ) {}

  get selectedTeam() {
    return this.state.selectedTeam;
  }

  get selectedTeamName() {
    return this.state.selectedTeamName;
  }

  get selectedTeamDescription() {
    return this.state.selectedTeamDescription;
  }

  get selectedTeamUsers() {
    return this.state.selectedTeamUsers as User[];
  }

  setDisplay(value: number) {
    this.state.display = value;
  }

  sendRequest(username: string) {}

  fetchUsername() {
    return localStorage.getItem('username') as string;
  }

  cancelRequest(username: string) {}

  acceptRequest(username: string) {}
}
