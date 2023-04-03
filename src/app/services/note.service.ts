import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  BACKEND_API = 'http://localhost:8000/api/notes';

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  fetchNotes() {
    this.authService.getCSRF();

    const options = {
      withCredentials: true,
    };

    return this.httpClient.get(
      `${this.BACKEND_API}/note/`,
      options
    ) as Observable<any>;
  }

  createNote(payload: any) {
    this.authService.getCSRF();

    const headers = {
      'Content-Type': 'application/json',
      'X-CSRFToken': AppComponent.csrfToken,
    };
    const options = {
      headers,
      withCredentials: true,
    };

    return this.httpClient.post(
      `${this.BACKEND_API}/note/`,
      payload,
      options
    ) as Observable<any>;
  }

  deleteNote(payload: any) {
    this.authService.getCSRF();

    const headers = {
      'Content-Type': 'application/json',
      'X-CSRFToken': AppComponent.csrfToken,
    };
    const options = {
      headers,
      withCredentials: true,
    };

    return this.httpClient.request(
      'delete',
      `${this.BACKEND_API}/note/`,
      {
        body: payload,
        ...options,
      }
    ) as Observable<any>;
  }

  editNote(payload: any) {
    this.authService.getCSRF();

    const headers = {
      'Content-Type': 'application/json',
      'X-CSRFToken': AppComponent.csrfToken,
    };
    const options = {
      headers,
      withCredentials: true,
    };

    return this.httpClient.put(
      `${this.BACKEND_API}/note/`,
      payload,
      options
    ) as Observable<any>;
  }
}
