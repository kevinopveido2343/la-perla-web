import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProduccionService {
  private API_URL = 'http://localhost:3000/api/produccion';

  constructor(private http: HttpClient) {}

  crearProduccion(data: any): Observable<any> {
    return this.http.post(this.API_URL, data);
  }

  obtenerProduccion(): Observable<any> {
    return this.http.get(this.API_URL);
  }

  editarProduccion(id: string, data: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, data);
  }

  eliminarProduccion(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
