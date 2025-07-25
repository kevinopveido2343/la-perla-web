import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProduccionService } from 'src/app/services/produccion.service';
import { ProductoService } from 'src/app/services/producto.service';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
@Component({
  selector: 'app-produccion',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, NavbarComponent],
  templateUrl: './produccion.page.html',
  styleUrls: ['./produccion.page.scss']
})
export class ProduccionPage implements OnInit {
  tipo: string = '';
  cantidad: number = 0;
  responsable: string = '';
  productos: any[] = [];
  producciones: any[] = [];
  editandoId: string | null = null;

  constructor(
    private produccionService: ProduccionService,
    private productoService: ProductoService
  ) {}

  ngOnInit() {
    this.obtenerProductos();
    this.obtenerProducciones();
  }

  obtenerProductos() {
    this.productoService.getProductos().subscribe({
      next: (res) => (this.productos = res),
      error: (err) => console.error('Error al obtener productos', err)
    });
  }

  obtenerProducciones() {
    this.produccionService.obtenerProduccion().subscribe({
      next: (data) => (this.producciones = data),
      error: () => alert('Error al obtener producciones')
    });
  }

  guardarProduccion() {
    if (!this.tipo || !this.cantidad || !this.responsable) {
      alert('Todos los campos son obligatorios');
      return;
    }

    const datos = {
      tipoEmpanada: this.tipo,
      cantidad: this.cantidad,
      responsable: this.responsable
    };

    if (this.editandoId) {
      this.produccionService.editarProduccion(this.editandoId, datos).subscribe({
        next: () => {
          alert('Producción actualizada ✅');
          this.obtenerProducciones();
          this.cancelarEdicion();
        },
        error: () => alert('Error al actualizar')
      });
    } else {
      this.produccionService.crearProduccion(datos).subscribe({
        next: () => {
          alert('Producción registrada ✅');
          this.obtenerProducciones();
          this.limpiarFormulario();
        },
        error: () => alert('Error al registrar producción ❌')
      });
    }
  }

  cargarProduccion(p: any) {
    this.editandoId = p._id;
    this.tipo = p.tipoEmpanada;
    this.cantidad = p.cantidad;
    this.responsable = p.responsable;
  }

  cancelarEdicion() {
    this.editandoId = null;
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.tipo = '';
    this.cantidad = 0;
    this.responsable = '';
  }

  eliminarProduccion(id: string) {
    if (confirm('¿Eliminar esta producción?')) {
      this.produccionService.eliminarProduccion(id).subscribe({
        next: () => this.obtenerProducciones(),
        error: () => alert('Error al eliminar')
      });
    }
  }
}
