import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
@Component({
  selector: 'app-productos',
  standalone: true,
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule, NavbarComponent]
})
export class ProductosPage implements OnInit {

  productos: any[] = [];
  productoEditando: any = null;

  nuevoProducto = {
    nombre: '',
    descripcion: '',
    precioVenta: null,
    precioProduccion: null
  };

  constructor(private productoService: ProductoService) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error('Error al obtener productos', err)
    });
  }

  guardarProducto() {
    const { nombre, descripcion, precioVenta, precioProduccion } = this.nuevoProducto;

    // Validaciones
    if (!nombre.trim() || !descripcion.trim()) {
      alert('Nombre y descripción son obligatorios');
      return;
    }

    if (
      precioVenta == null || isNaN(precioVenta) || precioVenta < 0 ||
      precioProduccion == null || isNaN(precioProduccion) || precioProduccion < 0
    ) {
      alert('Los precios deben ser números mayores o iguales a 0');
      return;
    }

    if (precioVenta < precioProduccion) {
      alert('El precio de venta debe ser mayor o igual al de producción');
      return;
    }

    // Si se está editando
    if (this.productoEditando) {
      this.productoService.actualizarProducto(this.productoEditando._id, this.nuevoProducto).subscribe({
        next: () => {
          this.cancelarEdicion();
          this.cargarProductos();
        },
        error: (err) => {
          console.error('Error al actualizar producto', err);
          alert('Error al actualizar producto');
        }
      });
    } else {
      // Si es un nuevo producto
      this.productoService.crearProducto(this.nuevoProducto).subscribe({
        next: () => {
          this.nuevoProducto = { nombre: '', descripcion: '', precioVenta: null, precioProduccion: null };
          this.cargarProductos();
        },
        error: (err) => {
          console.error('Error al registrar producto', err);
          alert('Error al registrar producto');
        }
      });
    }
  }

  eliminarProducto(id: string) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe({
        next: () => this.cargarProductos(),
        error: (err) => {
          console.error('Error al eliminar producto', err);
          alert('Error al eliminar producto');
        }
      });
    }
  }

  editarProducto(prod: any) {
    this.productoEditando = prod;
    this.nuevoProducto = {
      nombre: prod.nombre,
      descripcion: prod.descripcion,
      precioVenta: prod.precioVenta,
      precioProduccion: prod.precioProduccion
    };
  }

  cancelarEdicion() {
    this.productoEditando = null;
    this.nuevoProducto = {
      nombre: '',
      descripcion: '',
      precioVenta: null,
      precioProduccion: null
    };
  }
}
