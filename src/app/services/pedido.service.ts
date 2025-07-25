import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost:3000/api/pedidos';

  constructor(private http: HttpClient) {}

  // Método para obtener headers con token
  private obtenerHeadersConToken() {
    const token = localStorage.getItem('token') || '';
    return {
      Authorization: `Bearer ${token}`
    };
  }

  
  crearPedido(pedido: any): Observable<any> {
    const headers = new HttpHeaders(this.obtenerHeadersConToken());
    return this.http.post(`${this.apiUrl}`, pedido, { headers });
  }

  
  eliminarPedido(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }


  getPedidos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // 📋 Obtener pedidos del cliente autenticado
  getMisPedidos(): Observable<any> {
    const headers = new HttpHeaders(this.obtenerHeadersConToken());
    return this.http.get(`${this.apiUrl}/mios`, { headers });
  }

  getTodosLosPedidosAdmin(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin`);
  }

  // 🧾 Obtener pedidos del cliente logueado con facturas
  obtenerMisPedidos(): Observable<any[]> {
    const headers = new HttpHeaders(this.obtenerHeadersConToken());
    return this.http.get<any[]>(`${this.apiUrl}/mis-pedidos`, { headers });
  }
}
