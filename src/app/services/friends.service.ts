import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AppComponent } from '../app.component';

@Injectable({
  providedIn: 'root',
})
export class FriendsService {
  readonly BACKEND_API = 'http://192.168.1.3:8000/api/friends';

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getFriendRequests(): Observable<any> {
    const options = {};

    return this.httpClient.get(
      `${this.BACKEND_API}/get_requests/`,
      options
    ) as Observable<any>;
  }

  getUsers(): Observable<any> {
    const options = {};

    return this.httpClient.get(
      `${this.BACKEND_API}/get_users/`,
      options
    ) as Observable<any>;
  }

  getUserFriends(): Observable<any> {
    const options = {};

    return this.httpClient.get(
      `${this.BACKEND_API}/get_friends/`,
      options
    ) as Observable<any>;
  }

  sendFriendRequest(username: string) {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return this.httpClient.post(
      `${this.BACKEND_API}/send_request/`,
      { username: username },
      options
    ) as Observable<any>;
  }

  cancelFriendRequest(username: string) {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return this.httpClient.post(
      `${this.BACKEND_API}/cancel_request/`,
      { username: username },
      options
    ) as Observable<any>;
  }

  acceptFriendRequest(username: string) {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return this.httpClient.post(
      `${this.BACKEND_API}/accept_request/`,
      { username: username },
      options
    ) as Observable<any>;
  }

  declineFriendRequest(username: string) {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return this.httpClient.post(
      `${this.BACKEND_API}/decline_request/`,
      { username: username },
      options
    ) as Observable<any>;
  }

  removeFriend(username: string) {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return this.httpClient.post(
      `${this.BACKEND_API}/remove_friend/`,
      { username: username },
      options
    ) as Observable<any>;
  }

  getSentRequests(): Observable<any> {
    const options = {};

    return this.httpClient.get(
      `${this.BACKEND_API}/get_sent_requests/`,
      options
    ) as Observable<any>;
  }
}
