import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { StateManagerService } from '../services/state-manager.service';
import { FriendsService } from '../services/friends.service';
import { catchError } from 'rxjs/operators';
import { User } from '../models/User';
import { Friend } from '../models/Friend';

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
    private state: StateManagerService
  ) {}

  get friends() {
    return this.state.friends;
  }

  set friends(value: Friend[]) {
    this.state.friends = value;
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
    this.startPolling();
  }

  initPage(): void {
    this.fetchFriendRequests();
    this.fetchUsers();
    this.fetchFriends();
  }

  startPolling() {
    setInterval(() => {
      this.fetchFriendRequests();
      this.fetchUsers();
      this.fetchFriends();
    }, 5000);
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
          throw error;
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
          throw error;
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
          throw err;
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
      .subscribe((res) => this.initPage());
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
      .subscribe((res) => this.initPage());
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
      .subscribe((res) => this.initPage());
  }

  removeFriend(username: any) {
    this.state.selectedFriend = username;
    this.state.displayDeleteFriendModal = true;
  }

  cancelRequest(username: any) {
    this.state.selectedFriend = username;
    this.state.displayCancelRequestModal = true;
  }
}
