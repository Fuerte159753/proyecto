import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private apiUrl = 'http://tu-servidor/api'; // Reemplaza con la URL de tu servidor

  constructor(private http: HttpClient) {}

  // Realizar una solicitud GET
  get(endpoint: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${endpoint}`);
  }

  // Realizar una solicitud POST
  post(endpoint: string, data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(`${this.apiUrl}/${endpoint}`, data, httpOptions);
  }

  // Agrega métodos adicionales según tus necesidades, como PUT, DELETE, etc.
}
