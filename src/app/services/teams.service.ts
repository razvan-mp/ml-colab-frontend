import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AppComponent } from '../app.component';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  readonly BACKEND_API = 'http://192.168.0.102:8000/api/';
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getTeams(): Observable<any> {
    const options = {};

    return this.httpClient.get(
      `${this.BACKEND_API}team/`,
      options
    ) as Observable<any>;
  }

  getUserTeams(): Observable<any> {
    const options = {};

    return this.httpClient.get(
      `${this.BACKEND_API}team/get_user_teams/`,
      options
    ) as Observable<any>;
  }

  addUserToTeam(username: string, teamId: number): Observable<any> {
    const payload = {
      username: username,
      id: teamId,
    };

    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return this.httpClient.post(
      `${this.BACKEND_API}team/add_user/`,
      payload,
      options
    ) as Observable<any>;
  }

  deleteTeam(payload: any): Observable<any> {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return this.httpClient.request('delete', `${this.BACKEND_API}team/`, {
      body: payload,
      ...options,
    });
  }

  createTeam(payload: any): Observable<any> {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return this.httpClient.post(
      `${this.BACKEND_API}team/`,
      payload,
      options
    ) as Observable<any>;
  }

  updateTeam(payload: any): Observable<any> {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return this.httpClient.put(
      `${this.BACKEND_API}team/`,
      payload,
      options
    ) as Observable<any>;
  }

  removeUserFromTeam(payload: any): Observable<any> {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return this.httpClient.post(
      `${this.BACKEND_API}team/remove_user/`,
      payload,
      options
    ) as Observable<any>;
  }

  addUsersToTeam(payload: any): Observable<any> {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return this.httpClient.post(
      `${this.BACKEND_API}team/add_users/`,
      payload,
      options
    ) as Observable<any>;
  }
}
