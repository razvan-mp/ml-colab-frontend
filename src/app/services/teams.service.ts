import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  readonly BACKEND_API = 'http://localhost:8000/api/';
  options = {
    withCredentials: true,
  };
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getTeams(): Observable<any> {
    this.authService.getCSRF();

    return this.httpClient.get(
      `${this.BACKEND_API}team/`,
      this.options
    ) as Observable<any>;
  }

  getUserTeams(): Observable<any> {
    this.authService.getCSRF();

    return this.httpClient.get(
      `${this.BACKEND_API}team/get_user_teams/`,
      this.options
    ) as Observable<any>;
  }

  addUserToTeam(username: string, teamId: number): Observable<any> {
    this.authService.getCSRF();

    const payload = {
      username: username,
      id: teamId,
    };

    return this.httpClient.post(
      `${this.BACKEND_API}team/add_user/`,
      payload,
      this.options
    ) as Observable<any>;
  }

  deleteTeam(teamId: number): Observable<any> {
    this.authService.getCSRF();

    const payload = {
      id: teamId,
    };

    return this.httpClient.request('delete', `${this.BACKEND_API}team/`, {
      body: payload,
      ...this.options,
    });
  }

  createTeam(payload: any): Observable<any> {
    this.authService.getCSRF();

    return this.httpClient.post(
      `${this.BACKEND_API}team/`,
      payload,
      this.options
    ) as Observable<any>;
  }

  updateTeam(payload: any): Observable<any> {
    this.authService.getCSRF();

    return this.httpClient.put(
      `${this.BACKEND_API}team/`,
      payload,
      this.options
    ) as Observable<any>;
  }

  removeUserFromTeam(payload: any): Observable<any> {
    this.authService.getCSRF();

    return this.httpClient.post(
      `${this.BACKEND_API}team/remove_user/`,
      payload,
      this.options
    ) as Observable<any>;
  }
}
