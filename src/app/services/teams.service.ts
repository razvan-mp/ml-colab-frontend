import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  readonly BACKEND_API = 'http://localhost:8000/api/';
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getTeams(): Observable<any> {
    this.authService.getCSRF();

    const options = {
      withCredentials: true,
    };

    return this.httpClient.get(`${this.BACKEND_API}team/`, options) as Observable<any>;
  }

  getUserTeams(): Observable<any> {
    this.authService.getCSRF();

    const options = {
      withCredentials: true,
    };

    return this.httpClient.get(`${this.BACKEND_API}team/get_user_teams/`, options) as Observable<any>;
  }
}
