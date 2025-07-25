import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const usuario = localStorage.getItem('usuario');

  if (usuario) {
    const parsed = JSON.parse(usuario);
    if (parsed.rol === 'admin') {
      return true; // ✅ acceso permitido
    }
  }

  //  No autorizado: redirige al home
  router.navigate(['/home']);
  return false;
};
