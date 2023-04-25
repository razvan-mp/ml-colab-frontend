import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FriendsService } from '../services/friends.service';
import { StateManagerService } from '../services/state-manager.service';
import { catchError } from 'rxjs/operators';
import { TeamsService } from '../services/teams.service';

@Component({
  selector: 'app-user-friends-modals',
  providers: [MessageService],
  templateUrl: './user-friends-modals.component.html',
  styleUrls: ['./user-friends-modals.component.scss'],
})
export class UserFriendsModalsComponent {
  constructor(
    private messageService: MessageService,
    private friendsService: FriendsService,
    private teamService: TeamsService,
    private state: StateManagerService
  ) {}

  get displayDeleteRequestModal() {
    return this.state.displayDeleteRequestModal;
  }

  get selectedFriend() {
    return this.state.selectedFriend;
  }

  set selectedFriend(value: string) {
    this.state.selectedFriend = value;
  }

  get displayDeleteFriendModal() {
    return this.state.displayDeleteFriendModal;
  }

  set displayDeleteFriendModal(value: boolean) {
    this.state.displayDeleteFriendModal = value;
  }

  get displayCancelRequestModal() {
    return this.state.displayCancelRequestModal;
  }

  set displayCancelRequestModal(value: boolean) {
    this.state.displayCancelRequestModal = value;
  }

  set displaySidebar(value: boolean) {
    this.state.displaySidebar = value;
  }

  set friends(value: any) {
    this.state.friends = value;
  }

  deleteFriend() {
    this.friendsService
      .removeFriend(this.selectedFriend)
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message,
          });
          return err;
        })
      )
      .subscribe(() => {
        this.hideDeleteFriendModal();
        this.selectedFriend = '';
        this.friendsService
          .getUserFriends()
          .subscribe((friends) => (this.friends = friends));
      });
  }

  hideDeleteFriendModal() {
    this.displayDeleteFriendModal = false;
    this.displaySidebar = true;
  }

  hideCancelRequestModal() {
    this.displayCancelRequestModal = false;
    this.displaySidebar = true;
  }

  cancelRequest() {
    this.friendsService
      .cancelFriendRequest(this.selectedFriend)
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message,
          });
          return err;
        })
      )
      .subscribe(() => {
        this.hideCancelRequestModal();
        this.selectedFriend = '';
        this.friendsService
          .getUserFriends()
          .subscribe((friends) => (this.friends = friends));
        this.teamService
          .getTeams()
          .subscribe((teams) => (this.state.teams = teams));
        this.friendsService.getUsers().subscribe((users) => {
          this.state.users = users;
          this.friendsService.getSentRequests().subscribe((requests) => {
            this.state.sentFriendRequests = requests;
          });
        });
      });
  }

  hideDeclineRequestModal() {
    this.state.displayDeleteRequestModal = false;
    this.displaySidebar = true;
  }

  declineRequest() {
    this.friendsService
      .declineFriendRequest(this.selectedFriend)
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message,
          });
          return err;
        })
      )
      .subscribe(() => {
        this.hideDeclineRequestModal();
        this.selectedFriend = '';
        this.friendsService
          .getUserFriends()
          .subscribe((friends) => (this.friends = friends));
        this.teamService
          .getTeams()
          .subscribe((teams) => (this.state.teams = teams));
      });
  }
}
