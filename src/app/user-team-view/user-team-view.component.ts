import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { StateManagerService } from '../services/state-manager.service';
import { NoteService } from '../services/note.service';
import { User } from '../models/User';
import { FriendsService } from '../services/friends.service';
import { catchError } from 'rxjs/operators';
import { TeamsService } from '../services/teams.service';
import { Note } from '../models/Note';

@Component({
  selector: 'app-user-team-view',
  providers: [MessageService],
  templateUrl: './user-team-view.component.html',
  styleUrls: ['./user-team-view.component.scss'],
})
export class UserTeamViewComponent implements OnInit {
  constructor(
    private messageService: MessageService,
    private state: StateManagerService,
    private noteService: NoteService,
    private friendsService: FriendsService,
    private teamsService: TeamsService
  ) {}

  ngOnInit(): void {
    this.startPolling();
  }

  startPolling() {
    clearInterval(this.state.userTeamsPolling);
    clearInterval(this.state.userSocialPolling);
    clearInterval(this.state.userTeamViewPolling);
    this.state.userTeamViewPolling = setInterval(() => {
      this.updateView();
    }, 5000);
  }

  get selectedTeamNotes() {
    return this.state.selectedTeamNotes;
  }

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

  get selectedTeamNote() {
    return this.state.selectedTeamNote;
  }

  set selectedTeamNote(value: any) {
    this.state.selectedTeamNote = value;
  }

  setDisplay(value: number) {
    this.state.display = value;
  }

  updateView(): void {
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
        this.state.teams = res;
        const team = this.state.teams.find(
          (team) => team.id === this.state.selectedTeam
        );
        if (team) {
          this.state.selectedTeamName = team.name;
          this.state.selectedTeamDescription = team.description as string;
          this.state.selectedTeamUsers = team.users as User[];
          this.state.selectedTeamNotes = team.notes as Note[];
        } else {
          this.state.selectedTeamName = '';
          this.state.selectedTeamDescription = '';
          this.state.selectedTeamUsers = [];
          this.state.selectedTeamNotes = [];
          this.setDisplay(1);
        }
      });
  }

  sendRequest(username: string) {
    this.friendsService
      .sendFriendRequest(username)
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error,
          });
          return error;
        })
      )
      .subscribe(() => {
        this.updateView();
      });
  }

  cancelRequest(username: string) {
    this.state.selectedFriend = username;
    this.state.displaySidebar = false;
    this.state.displayCancelRequestModal = true;
  }

  acceptRequest(username: string) {
    this.friendsService
      .acceptFriendRequest(username)
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error,
          });
          return error;
        })
      )
      .subscribe(() => {
        this.updateView();
      });
  }

  declineRequest(username: string): void {
    this.state.selectedFriend = username;
    this.state.displaySidebar = false;
    this.state.displayDeleteRequestModal = true;
  }

  fetchUsername(): string {
    return localStorage.getItem('username') as string;
  }

  loadNote(): void {
    const selectedNoteObject = this.selectedTeamNotes.find(
      (note: Note) => note.id === this.selectedTeamNote
    )!;
    const page = selectedNoteObject.page;
    let graphData = JSON.parse(selectedNoteObject.graph_data);
    switch (page) {
      case 'id3':
        localStorage.setItem('id3Edges', graphData['edges']);
        localStorage.setItem('id3Nodes', graphData['nodes']);
        window.location.href = '/id3';
        break;
      case 'knn':
        localStorage.setItem('knn', JSON.stringify(graphData));
        window.location.href = '/knn';
        break;
      case 'hclustering':
        localStorage.setItem('hclustering', JSON.stringify(graphData));
        window.location.href = '/hclustering';
        break;
      case 'kmeans':
        localStorage.setItem('kmeans', JSON.stringify(graphData));
        window.location.href = '/kmeans';
        break;
    }
  }

  showCreateNoteModal(): void {
    this.state.displaySidebar = false;
    this.state.displayCreateNoteModal = true;
  }

  showDeleteNoteModal(): void {
    this.state.displaySidebar = false;
    this.state.displayDeleteModal = true;
  }

  showEditNoteModal(): void {
    for (const note of this.selectedTeamNotes) {
      if (note.id === this.selectedTeamNote) {
        this.state.noteContent = note.content as string;
        this.state.noteTitle = note.title as string;
        break;
      }
    }
    this.state.displaySidebar = false;
    this.state.displayEditNoteModal = true;
  }

  trimContent(content: any) {
    const maxLength = 75;
    if (content.length > maxLength) {
      return content.substring(0, maxLength) + '...';
    }
    return content;
  }
}
