import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    return true; // ✅ Token presente, permitir acceso
  }

  router.navigate(['/login']); //  No autenticado, redirigir
  return false;
};
