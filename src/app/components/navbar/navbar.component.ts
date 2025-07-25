
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  nombreUsuario: string = '';
  autenticado: boolean = false;
  rol: string = '';

  menuAbierto: boolean = false; // Nuevo: controla el desplegable

  constructor(private router: Router, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    const usuarioRaw = localStorage.getItem('usuario');
    const usuario = usuarioRaw ? JSON.parse(usuarioRaw) : null;

    this.nombreUsuario = usuario?.nombre ?? '';
    this.autenticado = !!usuario;
    this.rol = usuario?.rol ?? '';

    this.usuarioService.nombreUsuario$.subscribe((nombre) => {
      this.nombreUsuario = nombre ?? '';
      this.autenticado = !!nombre;
    });
  }

  get esAdmin(): boolean {
    return this.rol === 'admin';
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu() {
    this.menuAbierto = false;
  }

  irLogin() {
    this.router.navigate(['/login']);
    this.cerrarMenu();
  }

  irRegistro() {
    this.router.navigate(['/registro']);
    this.cerrarMenu();
  }

  cerrarSesion() {
    this.usuarioService.limpiarNombre();
    localStorage.clear();
    this.router.navigate(['/login']);
    this.cerrarMenu();
  }

 
  @HostListener('document:click', ['$event'])
  onClickFuera(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.navbar-right')) {
      this.menuAbierto = false;
    }
  }
}
