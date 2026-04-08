import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.html',
  styleUrls: ['./clientes.css'],
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  loading = false;
  mostrarModal = false;
  editando = false;
  searchDocumento = '';
  searchNombre = '';
  mensaje = '';
  tipoMensaje = '';
  private timeoutId: any = null;
  private ultimoClick = 0;

  formData: Cliente = {
    documento: '',
    nombre: '',
    telefono: '',
  };

  clienteOriginal: string = '';

  constructor(
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    console.log("Cargando clientes...");
    this.loading = true;
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        console.log("Datos recibidos:", data);
        this.clientes = [...data];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error:", err);
        this.mostrarMensaje('Error al cargar clientes', 'error');
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  buscarPorDocumento(): void {
    if (!this.searchDocumento) {
      this.cargarClientes();
      return;
    }
    this.loading = true;
    this.clienteService.getClienteByDocumento(this.searchDocumento).subscribe({
      next: (data) => {
        this.clientes = data ? [data] : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mostrarMensaje('Cliente no encontrado', 'error');
        this.clientes = [];
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  abrirModalCrear(): void {
    this.editando = false;
    this.formData = { documento: '', nombre: '', telefono: '' };
    this.mostrarModal = true;
  }

  abrirModalEditar(cliente: Cliente): void {
    this.editando = true;
    this.clienteOriginal = cliente.documento;
    this.formData = { ...cliente };
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

    if (this.editando) {
      this.clienteService.actualizarCliente(this.clienteOriginal, this.formData).subscribe({
        next: () => {
          this.mostrarMensaje('Cliente actualizado con éxito', 'success');
          this.cerrarModal();
          this.cargarClientes();
        },
        error: () => this.mostrarMensaje('Error al actualizar cliente', 'error'),
      });
    } else {
      this.clienteService.crearCliente(this.formData).subscribe({
        next: () => {
          this.mostrarMensaje('Cliente creado con éxito', 'success');
          this.cerrarModal();
          this.cargarClientes();
        },
        error: () => this.mostrarMensaje('Error al crear cliente', 'error'),
      });
    }
  }

  eliminar(documento: string): void {
    if (!confirm('¿Estás seguro de eliminar este cliente?')) return;
    this.clienteService.eliminarCliente(documento).subscribe({
      next: () => {
        this.mostrarMensaje('Cliente eliminado con éxito', 'success');
        this.cargarClientes();
      },
      error: (err) => {
        if (err.status === 200) {
          this.mostrarMensaje('Cliente eliminado con éxito', 'success');
          this.cargarClientes();
        } else {
          this.mostrarMensaje('Error al eliminar cliente', 'error');
        }
      }
    });
  }

  mostrarMensaje(msg: string, tipo: string): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    this.mensaje = msg;
    this.tipoMensaje = tipo;
    this.cdr.detectChanges();
    
    this.timeoutId = setTimeout(() => {
      this.mensaje = '';
      this.tipoMensaje = '';
      this.cdr.detectChanges();
      this.timeoutId = null;
    }, 3000);
  }

  get clientesFiltrados(): Cliente[] {
    return this.clientes.filter((c) =>
      c.nombre.toLowerCase().includes(this.searchNombre.toLowerCase()),
    );
  }
}