import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly BACKEND_API = 'http://192.168.1.3:8000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  changeUsername(payload: any): Observable<any> {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return this.http.post(
      `${this.BACKEND_API}/user/change_username/`,
      payload,
      options
    ) as Observable<any>;
  }

  changePassword(payload: any): Observable<any> {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return this.http.post(
      `${this.BACKEND_API}/user/change_password/`,
      payload,
      options
    ) as Observable<any>;
  }

  deleteAccount(payload: any): Observable<any> {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return this.http.post(
      `${this.BACKEND_API}/user/delete_account/`,
      payload,
      options
    ) as Observable<any>;
  }
}
