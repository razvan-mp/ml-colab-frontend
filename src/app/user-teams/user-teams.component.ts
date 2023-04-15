import { Component, OnDestroy, OnInit } from '@angular/core';
import { TeamsService } from '../services/teams.service';
import { MessageService } from 'primeng/api';
import { StateManagerService } from '../services/state-manager.service';
import { catchError } from 'rxjs/operators';
import { Team } from '../models/Team';
import { FriendsService } from '../services/friends.service';

@Component({
  selector: 'app-user-teams',
  providers: [MessageService],
  templateUrl: './user-teams.component.html',
  styleUrls: ['./user-teams.component.scss'],
})
export class UserTeamsComponent implements OnInit {
  menuOptions: any = [];

  constructor(
    private messageService: MessageService,
    private teamsService: TeamsService,
    private friendsService: FriendsService,
    private state: StateManagerService
  ) {}

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
    this.startPolling();
  }

  startPolling() {
    setInterval(() => {
      this.fetchTeams();
    }, 5000);
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
      .subscribe((res) => {
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
      .subscribe((res) => {
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
      .subscribe((res) => {
        this.fetchTeams();
      });
  }
}
