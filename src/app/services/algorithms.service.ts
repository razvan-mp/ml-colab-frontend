import { Injectable } from '@angular/core';
import { AppComponent } from '../app.component';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlgorithmsService {
  constructor(private httpClient: HttpClient) {}
  private BACKEND_API = AppComponent.BACKEND_URL + 'api/algorithms';

  getExampleId3() {
    return this.httpClient.get(`${this.BACKEND_API}/get_example_id3/`);
  }

  updateId3Data(payload: any): Observable<any> {
    return this.httpClient.post(
      `${this.BACKEND_API}/id3/`,
      payload
    ) as Observable<any>;
  }

  getExampleKnn() {
    return this.httpClient.get(`${this.BACKEND_API}/get_knn_example/`);
  }

  updateKnnData(payload: any): Observable<any> {
    return this.httpClient.post(
      `${this.BACKEND_API}/get_knn_response/`,
      payload
    ) as Observable<any>;
  }

  getExampleKmeans() {
    return this.httpClient.get(`${this.BACKEND_API}/get_example_k_means/`);
  }

  updateKmeansData(payload: any): Observable<any> {
    return this.httpClient.post(
      `${this.BACKEND_API}/get_k_means_response/`,
      payload
    ) as Observable<any>;
  }

  getExampleHclustering() {
    return this.httpClient.get(`${this.BACKEND_API}/get_example_hclustering/`);
  }

  updateHclusteringData(payload: any): Observable<any> {
    return this.httpClient.post(
      `${this.BACKEND_API}/get_hclustering_response/`,
      payload
    ) as Observable<any>;
  }
}
