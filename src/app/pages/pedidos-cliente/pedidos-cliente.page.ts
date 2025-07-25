import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PedidoService } from 'src/app/services/pedido.service';
import { ProductoService } from 'src/app/services/producto.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LOGO_BASE64 } from 'src/assets/logo-base64';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
@Component({
  selector: 'app-pedidos-cliente',
  templateUrl: './pedidos-cliente.page.html',
  styleUrls: ['./pedidos-cliente.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, NavbarComponent],
})
export class PedidosClientePage implements OnInit {
  productos: any[] = [];
  carrito: any[] = [];

  constructor(
    private productoService: ProductoService,
    private pedidoService: PedidoService
  ) {}

  ngOnInit() {
    this.obtenerProductos();
  }

  obtenerProductos() {
    this.productoService.getProductos().subscribe({
      next: (res) => {
        this.productos = res;
      },
      error: (err) => {
        console.error('Error al obtener productos', err);
      },
    });
  }

  agregar(producto: any) {
    const item = this.carrito.find(p => p._id === producto._id);
    if (item) {
      item.cantidad++;
    } else {
      this.carrito.push({ ...producto, cantidad: 1 });
    }
  }

  quitar(producto: any) {
    const index = this.carrito.findIndex(p => p._id === producto._id);
    if (index > -1) {
      this.carrito[index].cantidad--;
      if (this.carrito[index].cantidad <= 0) {
        this.carrito.splice(index, 1);
      }
    }
  }

  actualizarCantidad(producto: any, valor: string) {
    const cantidad = parseInt(valor, 10);
    if (isNaN(cantidad) || cantidad <= 0) return;

    const item = this.carrito.find(p => p._id === producto._id);
    if (item) {
      item.cantidad = cantidad;
    } else {
      this.carrito.push({ ...producto, cantidad });
    }
  }

  cantidadProducto(id: string): number {
    return this.carrito.find(p => p._id === id)?.cantidad || 0;
  }

  total(): number {
    return this.carrito.reduce((sum, item) => sum + item.precioVenta * item.cantidad, 0);
  }

  iva(): number {
    return this.total() * 0.19;
  }

  totalConIVA(): number {
    return this.total() + this.iva();
  }

  enviarPedido() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debe iniciar sesión');
      return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const clienteId = payload.id;

    const pedido = {
      cliente: clienteId,
      productos: this.carrito.map(p => ({
        nombre: p.nombre,
        cantidad: p.cantidad,
        precio: p.precioVenta,
        subtotal: p.precioVenta * p.cantidad
      })),
      total: this.total(),
      iva: this.iva(),
      totalConIVA: this.totalConIVA()
    };

    this.pedidoService.crearPedido(pedido).subscribe({
      next: () => {
        alert('Pedido enviado correctamente ✅');
        this.generarPDF();
        this.carrito = [];
      },
      error: (err) => {
        console.error(err);
        alert('Error al enviar el pedido ❌');
      }
    });
  }
generarPDF() {
  const doc = new jsPDF();
  const logoBase64 = LOGO_BASE64; // ✅ LOGO CORRECTO

  const token = localStorage.getItem('token');
  const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;

  const nombreCliente = payload?.nombre || 'Cliente';
  const correoCliente = payload?.correo || 'N/A';

  const facturaId = Math.floor(Math.random() * 1000000);

  // ✅ Agregar logo base64
  try {
    doc.addImage(logoBase64, 'PNG', 15, 10, 30, 30);
  } catch (err) {
    console.error('Error al agregar el logo al PDF', err);
  }

  // Título principal
  doc.setFontSize(18);
  doc.text('Factura - La Perla', 105, 20, { align: 'center' });

  // Información del cliente
  doc.setFontSize(11);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 15, 45);
  doc.text(`N° Factura: #${facturaId}`, 15, 52);
  doc.text(`Cliente: ${nombreCliente}`, 15, 59);
  doc.text(`Correo: ${correoCliente}`, 15, 66);

  // Tabla de productos
  const productos = this.carrito.map(item => [
    item.nombre,
    item.cantidad.toString(),
    `$${item.precioVenta}`,
    `$${item.precioVenta * item.cantidad}`
  ]);

  autoTable(doc, {
    startY: 75,
    head: [['Producto', 'Cantidad', 'Precio Unitario', 'Subtotal']],
    body: productos,
    headStyles: { fillColor: [0, 123, 255] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    styles: { halign: 'center' }
  });

  const finalY = (doc as any).lastAutoTable.finalY || 90;

  doc.setFontSize(12);
  doc.text(`Subtotal: $${this.total()}`, 15, finalY + 10);
  doc.text(`IVA (19%): $${this.iva().toFixed(0)}`, 15, finalY + 20);

  doc.setFontSize(14);
  doc.text(`Total: $${this.totalConIVA().toFixed(0)}`, 15, finalY + 35);

  doc.save(`factura_la_perla_${facturaId}.pdf`);
}

}


