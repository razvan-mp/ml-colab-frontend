import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  readonly BACKEND_API = 'http://localhost:8000/api';
  options: any = {
    withCredentials: true,
  };

  constructor(
    private httpClient: HttpClient,
  ) { }

  getFriendRequests(): Observable<any> {
    return this.httpClient.get(`${this.BACKEND_API}/get_requests/`, this.options) as Observable<any>;
  }
}
