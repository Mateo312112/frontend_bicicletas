import { Component, OnInit } from '@angular/core';
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
  mostrarModal = false;
  editando = false;
  searchDocumento = '';
  searchNombre = '';
  formData: Cliente = { documento: '', nombre: '', telefono: '' };
  clienteOriginal = '';
  mensaje = '';
  tipoMensaje = '';

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.searchNombre = '';
    this.searchDocumento = '';
    this.clienteService.getClientes().subscribe({
      next: (data) => { this.clientes = data; },
      error: () => { this.mostrarMensaje('Error al cargar clientes', 'error'); }
    });
  }

  buscarPorDocumento(): void {
    if (!this.searchDocumento) { this.cargarClientes(); return; }
    this.clienteService.getClienteByDocumento(this.searchDocumento).subscribe({
      next: (data) => { this.clientes = data ? [data] : []; },
      error: () => { this.mostrarMensaje('Cliente no encontrado', 'error'); this.clientes = []; }
    });
  }

  get clientesFiltrados(): Cliente[] {
    return this.clientes.filter((c) =>
      (c.nombre || '').toLowerCase().includes(this.searchNombre.toLowerCase())
    );
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

  cerrarModal(): void { this.mostrarModal = false; }

  guardar(): void {
    if (this.editando) {
      this.clienteService.actualizarCliente(this.clienteOriginal, this.formData).subscribe({
        next: () => { this.mostrarMensaje('Cliente actualizado', 'success'); this.cerrarModal(); this.cargarClientes(); },
        error: () => this.mostrarMensaje('Error al actualizar', 'error')
      });
    } else {
      this.clienteService.crearCliente(this.formData).subscribe({
        next: () => { this.mostrarMensaje('Cliente creado', 'success'); this.cerrarModal(); this.cargarClientes(); },
        error: () => this.mostrarMensaje('Error al crear', 'error')
      });
    }
  }

  eliminar(documento: string): void {
    if (!confirm('¿Eliminar este cliente?')) return;
    this.clienteService.eliminarCliente(documento).subscribe({
      next: () => { this.mostrarMensaje('Cliente eliminado', 'success'); this.cargarClientes(); },
      error: () => this.mostrarMensaje('Error al eliminar', 'error')
    });
  }

  mostrarMensaje(msg: string, tipo: string): void {
    this.mensaje = msg;
    this.tipoMensaje = tipo;
    setTimeout(() => this.mensaje = '', 3000);
  }
}