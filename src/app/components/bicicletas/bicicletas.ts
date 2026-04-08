import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  private ultimoClick = 0;

  formData: Bicicleta = {
    codigo: '',
    marca: '',
    modelo: '',
    tipo: '',
    precioLista: 0,
  };

  idOriginal: number = 0;
  tipos = ['Montaña', 'Ruta', 'Urbana'];

  constructor(private bicicletaService: BicicletaService,
    private cdr: ChangeDetectorRef  
  ) {}

  ngOnInit(): void {
    this.cargarBicicletas();
  }

cargarBicicletas(): void {
    console.log("Cargando bicicletas...");
    this.loading = true;
    this.bicicletaService.getBicicletas().subscribe({
      next: (data) => {
        console.log("Datos recibidos:", data);
        this.bicicletas = data;
        this.loading = false;
        this.cdr.detectChanges();  // ← Fuerza la actualización de la vista
      },
      error: (err) => {
        console.error("Error:", err);
        this.mostrarMensaje('Error al cargar bicicletas', 'error');
        this.loading = false;
        this.cdr.detectChanges();  // ← Fuerza la actualización
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
    const ahora = Date.now();
    if (ahora - this.ultimoClick < 1000) {
      console.log('Click ignorado - muy rápido');
      return;
    }
    this.ultimoClick = ahora;
    
    console.log('Guardando...');
    
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
        // Recargar la lista completa desde el backend
        this.cargarBicicletas();
      },
      error: (err) => {
        // Si el error es 200 o OK, la eliminación fue exitosa
        if (err.status === 200 || err.status === 204) {
          this.mostrarMensaje('Bicicleta eliminada con éxito', 'success');
          this.cargarBicicletas();
        } else {
          console.error('Error:', err);
          this.mostrarMensaje('Error al eliminar bicicleta', 'error');
        }
      }
    });
}

mostrarMensaje(msg: string, tipo: string): void {
    this.mensaje = msg;
    this.tipoMensaje = tipo;
    
    setTimeout(() => {
        this.mensaje = '';
        this.tipoMensaje = '';
        this.cdr.detectChanges();  // Forzar actualización
    }, 3000);
}

  get bicicletasFiltradas(): Bicicleta[] {
    return this.bicicletas.filter(
      (b) =>
        b.marca.toLowerCase().includes(this.searchMarca.toLowerCase()) &&
        b.tipo.toLowerCase().includes(this.searchTipo.toLowerCase()),
    );
  }
}