import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BicicletaService } from '../../services/bicicleta.service';
import { Bicicleta } from '../../models/bicicleta.model';

@Component({
  selector: 'app-bicicletas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bicicletas.html',
  styleUrls: ['./bicicletas.css'],
})
export class BicicletasComponent implements OnInit {
  bicicletas: Bicicleta[] = [];
  loading = false;
  mostrarModal = false;
  editando = false;
  searchMarca = '';
  searchTipo = '';
  mensaje = '';
  tipoMensaje = '';

  formData: Bicicleta = {
    codigo: '',
    marca: '',
    modelo: '',
    tipo: '',
    precioLista: 0,
  };

  idOriginal: number = 0;

  tipos = ['Montaña', 'Ruta', 'Urbana'];

  constructor(private bicicletaService: BicicletaService) {}

  ngOnInit(): void {
    this.cargarBicicletas();
  }

  cargarBicicletas(): void {
    this.loading = true;
    this.bicicletaService.getBicicletas().subscribe({
      next: (data) => {
        this.bicicletas = data;
        this.loading = false;
      },
      error: () => {
        this.mostrarMensaje('Error al cargar bicicletas', 'error');
        this.loading = false;
      },
    });
  }

  abrirModalCrear(): void {
    this.editando = false;
    this.formData = { codigo: '', marca: '', modelo: '', tipo: '', precioLista: 0 };
    this.mostrarModal = true;
  }

  abrirModalEditar(bicicleta: Bicicleta): void {
    this.editando = true;
    this.idOriginal = bicicleta.idBicicleta!;
    this.formData = { ...bicicleta };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  guardar(): void {
    if (this.editando) {
      this.bicicletaService.actualizarBicicleta(this.idOriginal, this.formData).subscribe({
        next: () => {
          this.mostrarMensaje('Bicicleta actualizada con éxito', 'success');
          this.cerrarModal();
          this.cargarBicicletas();
        },
        error: () => this.mostrarMensaje('Error al actualizar bicicleta', 'error'),
      });
    } else {
      this.bicicletaService.crearBicicleta(this.formData).subscribe({
        next: () => {
          this.mostrarMensaje('Bicicleta creada con éxito', 'success');
          this.cerrarModal();
          this.cargarBicicletas();
        },
        error: () => this.mostrarMensaje('Error al crear bicicleta', 'error'),
      });
    }
  }

  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta bicicleta?')) return;
    this.bicicletaService.eliminarBicicleta(id).subscribe({
      next: () => {
        this.mostrarMensaje('Bicicleta eliminada con éxito', 'success');
        this.cargarBicicletas();
      },
      error: () => this.mostrarMensaje('Error al eliminar bicicleta', 'error'),
    });
  }

  mostrarMensaje(msg: string, tipo: string): void {
    this.mensaje = msg;
    this.tipoMensaje = tipo;
    setTimeout(() => (this.mensaje = ''), 3000);
  }

  get bicicletasFiltradas(): Bicicleta[] {
    return this.bicicletas.filter(
      (b) =>
        b.marca.toLowerCase().includes(this.searchMarca.toLowerCase()) &&
        b.tipo.toLowerCase().includes(this.searchTipo.toLowerCase()),
    );
  }
}
