import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ClienteService } from 'src/app/services/cliente.service';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule,NavbarComponent],
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit {
  cliente = {
    nombre: '',
    correo: '',
    telefono: '',
    direccion: ''
  };

  clientes: any[] = [];
  clienteEditando: boolean = false;
  idEditando: string = '';

  constructor(private clienteService: ClienteService) {}

  ngOnInit() {
    this.obtenerClientes();
  }

  obtenerClientes() {
    this.clienteService.getClientes().subscribe({
      next: (data) => this.clientes = data,
      error: (error) => console.error('Error al obtener clientes:', error)
    });
  }

  guardarCliente() {
    if (this.clienteEditando) {
      this.clienteService.actualizarCliente(this.idEditando, this.cliente).subscribe({
        next: () => {
          this.obtenerClientes();
          this.cancelarEdicion();
        },
        error: (err) => console.error('Error al actualizar cliente:', err)
      });
    } else {
      this.clienteService.crearCliente(this.cliente).subscribe({
        next: () => {
          this.obtenerClientes();
          this.cancelarEdicion();
        },
        error: (err) => console.error('Error al crear cliente:', err)
      });
    }
  }

  editarCliente(cliente: any) {
    this.cliente = { ...cliente };
    this.idEditando = cliente._id;
    this.clienteEditando = true;
  }

  eliminarCliente(id: string) {
    this.clienteService.eliminarCliente(id).subscribe({
      next: () => this.obtenerClientes(),
      error: (err) => console.error('Error al eliminar cliente:', err)
    });
  }

  cancelarEdicion() {
    this.clienteEditando = false;
    this.idEditando = '';
    this.cliente = { nombre: '', correo: '', telefono: '', direccion: '' };
  }
}
