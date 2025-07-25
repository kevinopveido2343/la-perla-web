import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';
export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.page').then( m => m.RegistroPage)
  },
  {
   
    path: 'productos',
    loadComponent: () => import('./pages/productos/productos.page').then( m => m.ProductosPage),
     canActivate: [adminGuard]
     
  },
  {
    path: 'clientes',
    loadComponent: () => import('./pages/clientes/clientes.page').then( m => m.ClientesPage),
     canActivate: [adminGuard]
  },
 


  {
    path: 'pedidos-cliente',
    loadComponent: () => import('./pages/pedidos-cliente/pedidos-cliente.page').then( m => m.PedidosClientePage),
    canActivate: [authGuard]
  },
  {
    path: 'pedidos-admin',
    loadComponent: () => import('./pages/pedidos-admin/pedidos-admin.page').then( m => m.PedidosAdminPage),
     canActivate: [adminGuard]
  },
  {
    path: 'produccion',
    loadComponent: () => import('./pages/produccion/produccion.page').then( m => m.ProduccionPage),
     canActivate: [adminGuard]
  },
  {
    path: 'dashboard-admin',
    loadComponent: () => import('./pages/dashboard-admin/dashboard-admin.page').then( m => m.DashboardAdminPage),
    canActivate: [adminGuard]
  },
  
  {
    path: 'reportes-admin',
    loadComponent: () => import('./pages/reportes-admin/reportes-admin.page').then( m => m.ReportesAdminPage),
        canActivate: [adminGuard]
  },
  {
  path: 'mis-pedidos',
  loadComponent: () => import('./pages/mis-pedidos/mis-pedidos.page').then(m => m.MisPedidosPage)
}


];
