import { Component, OnInit } from '@angular/core';
import { TeamsService } from '../services/teams.service';
import { MessageService } from 'primeng/api';
import { StateManagerService } from '../services/state-manager.service';
import { catchError } from 'rxjs/operators';
import { Team } from '../models/Team';
import { FriendsService } from '../services/friends.service';
import { Friend } from '../models/Friend';
import { User } from '../models/User';
import { Note } from '../models/Note';

@Component({
  selector: 'app-user-teams',
  providers: [MessageService],
  templateUrl: './user-teams.component.html',
  styleUrls: ['./user-teams.component.scss'],
})
export class UserTeamsComponent implements OnInit {
  constructor(
    private messageService: MessageService,
    private teamsService: TeamsService,
    private friendsService: FriendsService,
    private state: StateManagerService
  ) {}

  get friends() {
    return this.state.friends;
  }

  set friends(value: Friend[]) {
    this.state.friends = value;
  }

  get teams() {
    return this.state.teams;
  }

  set teams(value: Team[]) {
    this.state.teams = value;
  }

  get userTeams() {
    return this.state.userTeams;
  }

  set userTeams(value: Team[]) {
    this.state.userTeams = value;
  }

  ngOnInit(): void {
    this.fetchTeams();
    this.fetchFriends();
    this.startPolling();
  }

  startPolling() {
    clearInterval(this.state.userTeamsPolling);
    clearInterval(this.state.userSocialPolling);
    clearInterval(this.state.userTeamViewPolling);
    this.state.userTeamsPolling = setInterval(() => {
      this.fetchTeams();
      this.fetchFriends();
    }, 5000);
  }

  fetchFriends(): void {
    this.friendsService
      .getUserFriends()
      .subscribe((res) => (this.friends = res));
  }

  fetchTeams(): void {
    this.teamsService
      .getTeams()
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error while fetching teams',
          });
          throw error;
        })
      )
      .subscribe((res: any) => {
        this.teams = res;
        console.log(this.teams);
      });
    this.teamsService
      .getUserTeams()
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error while fetching teams',
          });
          throw error;
        })
      )
      .subscribe((res: any) => {
        this.userTeams = res;
      });
  }

  fetchUsername(): string {
    return localStorage.getItem('username') as string;
  }

  cancelRequest(username: string) {
    this.state.selectedFriend = username;
    this.state.displayCancelRequestModal = true;
  }

  sendRequest(username: string) {
    this.friendsService
      .sendFriendRequest(username)
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error while sending friend request',
          });
          throw error;
        })
      )
      .subscribe(() => {
        this.fetchTeams();
      });
  }

  acceptRequest(username: string) {
    this.friendsService
      .acceptFriendRequest(username)
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error while accepting friend request',
          });
          throw error;
        })
      )
      .subscribe(() => {
        this.fetchTeams();
      });
  }

  declineRequest(username: string) {
    this.friendsService
      .declineFriendRequest(username)
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error while declining friend request',
          });
          throw error;
        })
      )
      .subscribe(() => {
        this.fetchTeams();
      });
  }

  displayCreateTeamModal() {
    this.state.displaySidebar = false;
    this.state.displayCreateTeamModal = true;
  }

  displayManageTeamModal(teamId: number) {
    this.state.selectedTeam = teamId;
    let tmp = this.userTeams.filter((team: Team) => team.id === teamId);
    this.state.selectedTeamUsers = tmp[0].users as User[];
    this.state.selectedTeamName = tmp[0].name;
    this.state.selectedTeamDescription = tmp[0].description as string;
    this.state.displaySidebar = false;
    this.state.displayManageTeamModal = true;
  }

  viewSelectedTeam(team: Team) {
    this.state.selectedTeam = team.id;
    this.state.selectedTeamName = team.name;
    this.state.selectedTeamDescription = team.description as string;
    this.state.selectedTeamUsers = team.users as User[];
    this.state.selectedTeamNotes = team.notes as Note[];
    this.state.display = 3;
  }
}
