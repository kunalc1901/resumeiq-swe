import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const api_url: string = environment.api_url + environment.api_url_postfix;

const httpHeaders = new HttpHeaders({
  'Content-Type': 'application/json',
});

const httpOptions = {
  headers: httpHeaders,
};

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get(
    path: string,
    headers: HttpHeaders = httpHeaders,
    params: HttpParams = new HttpParams(),
  ): Observable<any> {
    return this.http.get(`${api_url}${path}`, { headers, params });
  }

  put(path: string, body: Object = {}, options = httpOptions): Observable<any> {
    return this.http.put(`${api_url}${path}`, JSON.stringify(body), options);
  }

  patch(
    path: string,
    body: Object = {},
    options = httpOptions,
  ): Observable<any> {
    return this.http.patch(`${api_url}${path}`, JSON.stringify(body), options);
  }

  post(
    path: string,
    body: Object = {},
    options = httpOptions,
    params?: HttpParams,
  ): Observable<any> {
    const opts = params ? { ...options, params } : options;
    return this.http.post(`${api_url}${path}`, JSON.stringify(body), opts);
  }

  delete(path: any, options: Object = {}): Observable<any> {
    return this.http.delete(`${api_url}${path}`, options);
  }
}