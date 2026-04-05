import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetalleVentaService } from '../../services/detalle-venta.service';
import { DetalleVenta } from '../../models/detalle-venta.model';

@Component({
  selector: 'app-detalle-venta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-venta.component.html',
  styleUrls: ['./detalle-venta.component.css'],
})
export class DetalleVentaComponent implements OnInit {
  detalles: DetalleVenta[] = [];
  loading = false;
  mostrarModal = false;
  mensaje = '';
  tipoMensaje = '';
  searchVenta = '';

  formData: any = {
    idVenta: null,
    bicicleta: { idBicicleta: null },
    cantidad: 1,
    precioUnitarioVenta: 0,
    subtotal: 0,
  };

  constructor(private detalleVentaService: DetalleVentaService) {}

  ngOnInit(): void {
    this.cargarDetalles();
  }

  cargarDetalles(): void {
    this.loading = true;
    this.detalleVentaService.getDetalles().subscribe({
      next: (data) => {
        this.detalles = data;
        this.loading = false;
      },
      error: () => {
        this.mostrarMensaje('Error al cargar detalles', 'error');
        this.loading = false;
      },
    });
  }

  calcularSubtotal(): void {
    this.formData.subtotal = this.formData.cantidad * this.formData.precioUnitarioVenta;
  }

  abrirModalCrear(): void {
    this.formData = {
      idVenta: null,
      bicicleta: { idBicicleta: null },
      cantidad: 1,
      precioUnitarioVenta: 0,
      subtotal: 0,
    };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  guardar(): void {
    this.detalleVentaService.crearDetalle(this.formData).subscribe({
      next: () => {
        this.mostrarMensaje('Detalle registrado con éxito', 'success');
        this.cerrarModal();
        this.cargarDetalles();
      },
      error: () => this.mostrarMensaje('Error al registrar detalle', 'error'),
    });
  }

  mostrarMensaje(msg: string, tipo: string): void {
    this.mensaje = msg;
    this.tipoMensaje = tipo;
    setTimeout(() => (this.mensaje = ''), 3000);
  }

  get detallesFiltrados(): DetalleVenta[] {
    if (!this.searchVenta) return this.detalles;
    return this.detalles.filter((d) => d.idVenta.toString().includes(this.searchVenta));
  }
}
