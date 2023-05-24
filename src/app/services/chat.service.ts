import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AppComponent } from '../app.component';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  readonly BACKEND_API = 'http://192.168.1.3:8000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getChatMessages(username: string): Observable<any> {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return this.http.post(
      `${this.BACKEND_API}/chat/get_messages/`,
      { username },
      options
    ) as Observable<any>;
  }

  sendMessage(payload: any): Observable<any> {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return this.http.post(
      `${this.BACKEND_API}/chat/send_message/`,
      payload,
      options
    ) as Observable<any>;
  }
}
