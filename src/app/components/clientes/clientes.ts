import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  loading = false;
  mostrarModal = false;
  editando = false;
  searchDocumento = '';
  searchNombre = '';

  formData: Cliente = {
    documento: '',
    nombre: '',
    telefono: ''
  };

  clienteOriginal: string = '';
  mensaje = '';
  tipoMensaje = '';

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.loading = true;
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.loading = false;
      },
      error: () => {
        this.mostrarMensaje('Error al cargar clientes', 'error');
        this.loading = false;
      }
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
      },
      error: () => {
        this.mostrarMensaje('Cliente no encontrado', 'error');
        this.clientes = [];
        this.loading = false;
      }
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
    if (this.editando) {
      this.clienteService.actualizarCliente(this.clienteOriginal, this.formData).subscribe({
        next: () => {
          this.mostrarMensaje('Cliente actualizado con éxito', 'success');
          this.cerrarModal();
          this.cargarClientes();
        },
        error: () => this.mostrarMensaje('Error al actualizar cliente', 'error')
      });
    } else {
      this.clienteService.crearCliente(this.formData).subscribe({
        next: () => {
          this.mostrarMensaje('Cliente creado con éxito', 'success');
          this.cerrarModal();
          this.cargarClientes();
        },
        error: () => this.mostrarMensaje('Error al crear cliente', 'error')
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
      error: () => this.mostrarMensaje('Error al eliminar cliente', 'error')
    });
  }

  mostrarMensaje(msg: string, tipo: string): void {
    this.mensaje = msg;
    this.tipoMensaje = tipo;
    setTimeout(() => this.mensaje = '', 3000);
  }

  get clientesFiltrados(): Cliente[] {
    return this.clientes.filter(c =>
      c.nombre.toLowerCase().includes(this.searchNombre.toLowerCase())
    );
  }
}
