import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, NavbarComponent],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  correo: string = '';
  contrasena: string = '';
  error: string = '';

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  login() {
    if (!this.correo || !this.contrasena) {
      this.error = 'Por favor ingrese correo y contraseña.';
      return;
    }

    const datos = { correo: this.correo, contrasena: this.contrasena };

    this.usuarioService.login(datos).subscribe({
      next: (respuesta) => {
        if (respuesta.token && respuesta.usuario) {
          
          localStorage.setItem('token', respuesta.token);
          localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));

          this.usuarioService.establecerNombre(respuesta.usuario.nombre);

          // Redirigir según el rol
         if (respuesta.usuario.rol === 'admin') {
  this.router.navigate(['/dashboard-admin']); 
} else {
  this.router.navigate(['/home']);
}

        } else {
          this.error = 'Credenciales incorrectas.';
        }
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al iniciar sesión.';
      },
    });
  }
}
