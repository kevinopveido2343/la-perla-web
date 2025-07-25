import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private nombreUsuarioSubject = new BehaviorSubject<string | null>(null);
  nombreUsuario$ = this.nombreUsuarioSubject.asObservable();

  constructor(private http: HttpClient) {
    
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      if (usuario?.nombre) {
        this.nombreUsuarioSubject.next(usuario.nombre);
      }
    }
  }

  login(datos: { correo: string; contrasena: string }) {
    return this.http.post<any>('http://localhost:3000/api/usuarios/login', datos);
  }

  registrar(usuario: any) {
    return this.http.post('http://localhost:3000/api/usuarios/registro', usuario);
  }

  establecerNombre(nombre: string) {
    this.nombreUsuarioSubject.next(nombre);
  }

  obtenerNombre(): string | null {
    return this.nombreUsuarioSubject.value;
  }

  limpiarNombre() {
    this.nombreUsuarioSubject.next(null);
    localStorage.clear();
  }

  estaAutenticado(): boolean {
    return !!localStorage.getItem('token');
  }
}
