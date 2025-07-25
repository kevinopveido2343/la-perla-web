import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PedidoService } from 'src/app/services/pedido.service';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
@Component({
  selector: 'app-pedidos-admin',
  standalone: true,
  imports: [CommonModule, IonicModule, NavbarComponent],
  templateUrl: './pedidos-admin.page.html',
  styleUrls: ['./pedidos-admin.page.scss'],
})
export class PedidosAdminPage implements OnInit {
  pedidos: any[] = [];

  constructor(private pedidoService: PedidoService) {}

  ngOnInit() {
    this.obtenerPedidos();
  }

  eliminarPedido(id: string) {
  if (confirm('¿Estás seguro de eliminar este pedido?')) {
    this.pedidoService.eliminarPedido(id).subscribe({
      next: () => {
        this.pedidos = this.pedidos.filter(p => p._id !== id);
      },
      error: (err) => {
        console.error('Error al eliminar pedido:', err);
        alert('No se pudo eliminar el pedido.');
      }
    });
  }
}

  obtenerPedidos() {
    this.pedidoService.getTodosLosPedidosAdmin().subscribe({
      next: (data) => {
        this.pedidos = data;
      },
      error: (err) => {
        console.error('Error al obtener pedidos:', err);
      }
    });
  }
}
