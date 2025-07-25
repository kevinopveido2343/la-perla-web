import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, NavbarComponent],
  templateUrl: './dashboard-admin.page.html',
  styleUrls: ['./dashboard-admin.page.scss']
})
export class DashboardAdminPage implements OnInit {
  totalPedidos: number = 0;
  produccionHoy: number = 0;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.obtenerDatosDashboard();
  }

  obtenerDatosDashboard() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>('http://localhost:3000/api/admin/dashboard', { headers }).subscribe({
      next: (res) => {
        this.totalPedidos = res.totalPedidos;
        this.produccionHoy = res.produccionHoy;
      },
      error: (err) => {
        console.error('Error al obtener dashboard', err);
        this.router.navigate(['/home']);
      }
    });
  }
}


