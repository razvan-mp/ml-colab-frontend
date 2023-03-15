import { Injectable } from '@angular/core';
import { AppComponent } from '../app.component';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  BACKEND_URL = AppComponent.BACKEND_URL + "api/auth";
  private accessToken: string = '';
  private refreshToken: string = '';
  constructor(
    private httpClient: HttpClient,
    ) {}


  registerUser(payload: any): Observable<any> {
    return this.httpClient.post(`${this.BACKEND_URL}/register/`, payload) as Observable<any>;
  }
  
  loginUser(payload: any): Observable<any> {
    return this.httpClient.post(`${this.BACKEND_URL}/login/`, payload) as Observable<any>;
  }
}
