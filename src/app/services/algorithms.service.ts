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
    return this.httpClient.get(`${this.BACKEND_API}/id3/`);
  }

  updateId3Data(payload: any): Observable<any> {
    return this.httpClient.post(
      `${this.BACKEND_API}/id3/`,
      payload
    ) as Observable<any>;
  }

  getExampleKnn() {
    return this.httpClient.get(`${this.BACKEND_API}/knn/`);
  }

  updateKnnData(payload: any): Observable<any> {
    return this.httpClient.post(
      `${this.BACKEND_API}/knn/`,
      payload
    ) as Observable<any>;
  }

  getExampleKmeans() {
    return this.httpClient.get(`${this.BACKEND_API}/kmeans/`);
  }

  updateKmeansData(payload: any): Observable<any> {
    return this.httpClient.post(
      `${this.BACKEND_API}/kmeans/`,
      payload
    ) as Observable<any>;
  }

  getExampleHclustering() {
    return this.httpClient.get(`${this.BACKEND_API}/hclustering/`);
  }

  updateHclusteringData(payload: any): Observable<any> {
    return this.httpClient.post(
      `${this.BACKEND_API}/hclustering/`,
      payload
    ) as Observable<any>;
  }

  getRandomData(algorithm: string) {
    return this.httpClient.post(`${this.BACKEND_API}/get_random_data/`, {
      algorithm,
    }) as Observable<any>;
  }
}
