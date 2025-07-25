import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-bienvenida-modal',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './bienvenida-modal.component.html',
  styleUrls: ['./bienvenida-modal.component.scss']
})
export class BienvenidaModalComponent {
  @Output() cerrar = new EventEmitter<void>();

  cerrarModal() {
    this.cerrar.emit();
  }
}
