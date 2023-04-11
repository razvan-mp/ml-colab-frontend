import {Component, OnDestroy, OnInit} from '@angular/core';
import {TeamsService} from '../services/teams.service';
import {MessageService} from 'primeng/api';
import {StateManagerService} from '../services/state-manager.service';
import {catchError} from "rxjs/operators";
import {Team} from '../models/Team';

@Component({
  selector: 'app-user-teams',
  providers: [MessageService],
  templateUrl: './user-teams.component.html',
  styleUrls: ['./user-teams.component.scss'],
})
export class UserTeamsComponent implements OnInit, OnDestroy {
  constructor(
    private messageService: MessageService,
    private teamsService: TeamsService,
    private _state: StateManagerService
  ) {
  }

  get teams() {
    return this._state.teams;
  }

  set teams(value: Team[]) {
    this._state.teams = value;
  }

  get userTeams() {
    return this._state.userTeams;
  }

  set userTeams(value: Team[]) {
    this._state.userTeams = value;
  }

  ngOnInit(): void {
    this.fetchTeams();
  }

  fetchTeams(): void {
    this.teamsService.getTeams()
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
      })
    this.teamsService.getUserTeams()
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
      })
  }

  ngOnDestroy(): void {
    this.teams = [];
  }
}
