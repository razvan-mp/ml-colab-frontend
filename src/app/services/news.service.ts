import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  BACKEND_API = 'http://localhost:8000/api/news';

  constructor(private httpClient: HttpClient) {}

  fetchNews() {
    return this.httpClient.get(`${this.BACKEND_API}/`) as Observable<any>;
  }
}
