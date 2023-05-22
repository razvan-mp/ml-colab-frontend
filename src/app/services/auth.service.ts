import { Injectable } from '@angular/core';
import { AppComponent } from '../app.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  BACKEND_URL = AppComponent.BACKEND_URL + 'api/auth';
  constructor(private httpClient: HttpClient) {}

  getSession(): void {
    this.httpClient
      .get(`${this.BACKEND_URL}/session/`, {
        withCredentials: true,
        observe: 'response',
      })
      .pipe(
        catchError((error) => {
          return error;
        })
      )
      .subscribe((res: any) => {
        if (res.body['isAuthenticated']) {
          AppComponent.loggedIn = true;
        } else {
          AppComponent.loggedIn = false;
          this.getCSRF();
        }
      });
  }

  getCSRF(): void {
    this.httpClient
      .get(`${this.BACKEND_URL}/csrf/`, {
        withCredentials: true,
        observe: 'response',
      })
      .pipe(
        catchError((error) => {
          return error;
        })
      )
      .subscribe((res: any) => {
        console.log(res.headers)
        const csrfToken = res.headers.get('X-CSRFToken');
        AppComponent.csrfToken = csrfToken;
      });
  }

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRFToken': AppComponent.csrfToken,
    });
    const body = JSON.stringify({ username, password });
    return this.httpClient.post(`${this.BACKEND_URL}/login/`, body, {
      headers,
      withCredentials: true,
      observe: 'response',
    }) as Observable<any>;
  }

  logout(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRFToken': AppComponent.csrfToken,
    });
    return this.httpClient.get(`${this.BACKEND_URL}/logout/`, {
      headers,
      withCredentials: true,
      observe: 'response',
    }) as Observable<any>;
  }

  whoami(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRFToken': AppComponent.csrfToken,
    });
    return this.httpClient.get(`${this.BACKEND_URL}/whoami/`, {
      headers,
      withCredentials: true,
      observe: 'response',
    }) as Observable<any>;
  }

  register(username: string, email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRFToken': AppComponent.csrfToken,
    });
    const body = JSON.stringify({ username, email, password });
    return this.httpClient.post(`${this.BACKEND_URL}/register/`, body, {
      headers,
      withCredentials: true,
      observe: 'response',
    }) as Observable<any>;
  }
}
