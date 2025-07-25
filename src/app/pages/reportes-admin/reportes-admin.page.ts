// src/app/pages/reportes-admin/reportes-admin.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
Chart.register(...registerables);

@Component({
  selector: 'app-reportes-admin',
  standalone: true,
  imports: [CommonModule, IonicModule, HttpClientModule, NavbarComponent],
  templateUrl: './reportes-admin.page.html',
  styleUrls: ['./reportes-admin.page.scss']
})
export class ReportesAdminPage implements OnInit {
  totalGanancias: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarGanancias();
    this.cargarProduccion();
    this.cargarPedidosPorCliente();
  }

 cargarGanancias() {
  this.http.get<{ total: number }>('http://localhost:3000/api/reportes/ganancias')
    .subscribe({
      next: (data) => {
        console.log('Datos de ganancias recibidos:', data);
        this.totalGanancias = data.total;
        this.generarGraficoGanancias(data.total);
      },
      error: (err) => {
        console.error('Error al obtener ganancias', err);
      }
    });
}


  cargarProduccion() {
    this.http.get<any[]>('http://localhost:3000/api/reportes/produccion')
      .subscribe({
        next: (data) => {
          const labels = data.map(p => p._id);
          const cantidades = data.map(p => p.totalCantidad);
          this.generarGraficoProduccion(labels, cantidades);
        },
        error: (err) => {
          console.error('Error al obtener producción', err);
        }
      });
  }

  cargarPedidosPorCliente() {
    this.http.get<any[]>('http://localhost:3000/api/reportes/pedidos-cliente')
      .subscribe({
        next: (data) => {
          const labels = data.map(d => d.cliente);
          const cantidades = data.map(d => d.cantidad);
          this.generarGraficoPedidosPorCliente(labels, cantidades);
        },
        error: (err) => {
          console.error('Error al obtener pedidos por cliente', err);
        }
      });
  }

  generarGraficoGanancias(valor: number) {
    const canvas = document.getElementById('graficoGanancias') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    new Chart(ctx!, {
      type: 'doughnut',
      data: {
        labels: ['Ganancias'],
        datasets: [{
          data: [valor],
          backgroundColor: ['#ffc107'],
          borderColor: ['#000'],
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          legend: { display: true }
        }
      }
    });
  }

  generarGraficoProduccion(labels: string[], data: number[]) {
    const canvas = document.getElementById('graficoProduccion') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    new Chart(ctx!, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Producción por tipo de empanada',
          data,
          backgroundColor: '#28a745',
          borderColor: '#1c1c1c',
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          legend: { display: true }
        },
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  generarGraficoPedidosPorCliente(labels: string[], data: number[]) {
    const canvas = document.getElementById('graficoPedidos') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    new Chart(ctx!, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Pedidos por Cliente',
          data,
          backgroundColor: '#17a2b8',
          borderColor: '#000',
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          legend: { display: true }
        },
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
