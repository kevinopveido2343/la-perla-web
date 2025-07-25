import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PedidoService } from 'src/app/services/pedido.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule, IonicModule, NavbarComponent],
  templateUrl: './mis-pedidos.page.html',
  styleUrls: ['./mis-pedidos.page.scss']
})
export class MisPedidosPage implements OnInit {
  pedidos: any[] = [];

  constructor(private pedidoService: PedidoService) {}

  ngOnInit() {
    this.pedidoService.obtenerMisPedidos().subscribe({
      next: (data) => this.pedidos = data,
      error: (err) => console.error('Error al cargar pedidos', err)
    });
  }

  calcularTotal(pedido: any): number {
    return pedido.productos.reduce((acc: number, p: any) => acc + (p.precio * p.cantidad), 0);
  }
generarPDF(pedido: any) {
  try {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Factura - La Perla', 10, 10);
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date(pedido.fecha).toLocaleString()}`, 10, 20);
    doc.text(`ID Pedido: ${pedido._id}`, 10, 30);

    autoTable(doc, {
      startY: 40,
      head: [['Producto', 'Cantidad', 'Precio unitario', 'Subtotal']],
      body: pedido.productos.map((p: any) => [
        p.nombre,
        p.cantidad,
        `$${p.precio}`,
        `$${(p.precio * p.cantidad).toLocaleString()}`
      ])
    });

    const totalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text(`Total: $${pedido.total}`, 10, totalY);

    doc.save(`factura_${pedido._id}.pdf`);
  } catch (error) {
    console.error('Error al generar PDF:', error);
  }
}

}

