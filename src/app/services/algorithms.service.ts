import { Injectable } from '@angular/core';
import { AppComponent } from '../app.component';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlgorithmsService {
  constructor(private httpClient: HttpClient) {}
  BACKEND_API = AppComponent.BACKEND_URL + 'api';

  getExampleId3() {
    return this.httpClient.get(`${this.BACKEND_API}/get_example_id3/`);
  }

  updateId3Data(payload: any): Observable<any> {
    return this.httpClient.post(
      `${this.BACKEND_API}/id3/`,
      payload
    ) as Observable<any>;
  }
}
