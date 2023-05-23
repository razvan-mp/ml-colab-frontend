import { Injectable } from '@angular/core';
import { AppComponent } from '../app.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  BACKEND_URL = AppComponent.BACKEND_URL + 'api/auth';
  constructor(private httpClient: HttpClient) {}

  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return false;
    }

    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const expirationDate = new Date(tokenPayload.exp * 1000);
    const now = new Date();
    return expirationDate > now;
  }

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = JSON.stringify({ username, password });
    return this.httpClient.post(`${this.BACKEND_URL}/token/`, body, {
      headers,
      observe: 'response',
    }) as Observable<any>;
  }

  refreshToken() {
    console.log("in refresh token")
    const headers = {
      'Content-Type': 'application/json',
    };
    const refreshToken = localStorage.getItem('refresh_token') as string;
    return this.httpClient.post(`${this.BACKEND_URL}/token/refresh/`, {
      refresh: refreshToken,
    }, {headers: headers}).pipe(tap((token: any) => {
      console.log(token.access)
      localStorage.setItem('access_token', token.access);
      console.log(localStorage.getItem('access_token'))
    }));
  }

  logout(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.httpClient.post(`${this.BACKEND_URL}/logout/`, {
      refresh: localStorage.getItem('refresh_token'),
    }, {
      headers,

      observe: 'response',
    }) as Observable<any>;
  }

  register(username: string, email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = JSON.stringify({ username, email, password });
    return this.httpClient.post(`${this.BACKEND_URL}/register/`, body, {
      headers,

      observe: 'response',
    }) as Observable<any>;
  }
}
