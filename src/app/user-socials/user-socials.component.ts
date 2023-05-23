import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { StateManagerService } from '../services/state-manager.service';
import { FriendsService } from '../services/friends.service';
import { catchError } from 'rxjs/operators';
import { User } from '../models/User';
import { Friend } from '../models/Friend';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-user-socials',
  providers: [MessageService],
  templateUrl: './user-socials.component.html',
  styleUrls: ['./user-socials.component.scss'],
})
export class UserSocialsComponent implements OnInit {
  constructor(
    private messageService: MessageService,
    private friendsService: FriendsService,
    private socketService: SocketService,
    private state: StateManagerService
  ) {}

  get friends() {
    return this.state.friends;
  }

  set friends(value: Friend[]) {
    this.state.friends = value;
  }

  get sentFriendRequests() {
    return this.state.sentFriendRequests;
  }

  set sentFriendRequests(value) {
    this.state.sentFriendRequests = value;
  }

  get friendRequests() {
    return this.state.friendRequests;
  }

  set friendRequests(value: any) {
    this.state.friendRequests = value;
  }

  get users() {
    return this.state.users;
  }

  set users(value: User[]) {
    this.state.users = value;
  }

  ngOnInit(): void {
    this.initPage();
  }

  initPage(): void {
    this.fetchFriendRequests();
    this.fetchUsers();
    this.fetchFriends();
    this.fetchSentFriendRequests();
  }

  startPolling() {
    clearInterval(this.state.userTeamsPolling);
    clearInterval(this.state.userSocialPolling);
    clearInterval(this.state.userTeamViewPolling);
    this.state.userSocialPolling = setInterval(() => {
      this.fetchFriendRequests();
      this.fetchUsers();
      this.fetchFriends();
      this.fetchSentFriendRequests();
    }, 5000);
  }

  fetchSentFriendRequests() {
    this.friendsService
      .getSentRequests()
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error while fetching friend requests',
          });
          return error;
        })
      )
      .subscribe((res: any) => {
        this.sentFriendRequests = res;
      });
  }

  fetchFriendRequests(): void {
    this.friendsService
      .getFriendRequests()
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error while fetching friend requests',
          });
          return error;
        })
      )
      .subscribe((res: any) => {
        this.friendRequests = res;
      });
  }

  fetchUsers(): void {
    this.friendsService
      .getUsers()
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error while fetching users',
          });
          return error;
        })
      )
      .subscribe((res: any) => {
        this.users = res;
      });
  }

  fetchFriends(): void {
    this.friendsService
      .getUserFriends()
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error while fetching friends',
          });
          return err;
        })
      )
      .subscribe((res: any) => {
        this.friends = res;
      });
  }

  addFriend(username: string) {
    this.friendsService
      .sendFriendRequest(username)
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error sending friend request. Please try again!',
          });
          return error;
        })
      )
      .subscribe(() => this.initPage());
  }

  acceptFriendRequest(username: any) {
    this.friendsService
      .acceptFriendRequest(username)
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error accepting friend request. Please try again!',
          });
          return error;
        })
      )
      .subscribe(() => this.initPage());
  }

  declineFriendRequest(username: any) {
    this.friendsService
      .declineFriendRequest(username)
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error declining friend request. Please try again!',
          });
          return error;
        })
      )
      .subscribe(() => this.initPage());
  }

  removeFriend(username: any) {
    this.state.selectedFriend = username;
    this.state.displayDeleteFriendModal = true;
  }

  cancelRequest(username: any) {
    this.state.selectedFriend = username;
    this.state.displayCancelRequestModal = true;
  }

  openAddFriendDialog() {
    this.state.displaySidebar = false;
    this.state.displayAddFriendModal = true;
  }

  openDeclineRequestModal(sender: any) {
    this.state.selectedFriend = sender;
    this.state.displaySidebar = false;
    this.state.displayDeleteRequestModal = true;
  }

  openChat(friend: string): any {
    this.state.selectedFriend = friend;
    this.state.display = 4;
  }

  peerConnection!: RTCPeerConnection;

  foo(): void {
    this.peerConnection = new RTCPeerConnection();
    this.socketService.connect();
  }
}
