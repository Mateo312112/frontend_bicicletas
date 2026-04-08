import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentaService } from '../../services/venta.service';
import { ClienteService } from '../../services/cliente.service';
import { BicicletaService } from '../../services/bicicleta.service';
import { Venta } from '../../models/venta.model';
import { Cliente } from '../../models/cliente.model';
import { Bicicleta } from '../../models/bicicleta.model';

@Component({ 
  selector: 'app-ventas', 
  standalone: true, 
  imports: [CommonModule, FormsModule], 
  templateUrl: './ventas.html', 
  styleUrl: './ventas.css' 
})
export class Ventas implements OnInit {
  ventas: Venta[] = [];
  bicicletas: Bicicleta[] = [];
  loading = true;
  newModalOpen = false;
  detailModalOpen = false;
  selectedVenta: Venta | null = null;
  toast: { msg: string; type: 'success' | 'error' } | null = null;
  private timeoutId: any = null;
  private ultimoClick = 0;

  searchDoc = '';
  docCliente = '';
  clienteEncontrado: Cliente | null = null;
  items: { idBicicleta: number; cantidad: number }[] = [{ idBicicleta: 0, cantidad: 1 }];
  subtotales: number[] = [0];
  totalGeneral = 0;

  constructor(
    private svc: VentaService, 
    private cliSvc: ClienteService, 
    private biciSvc: BicicletaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { 
    this.cargarDatos(); 
  }

  cargarDatos() {
    this.loading = true;
    this.biciSvc.getBicicletas().subscribe({
      next: (d: Bicicleta[]) => {
        this.bicicletas = d;
        console.log("Bicicletas cargadas:", this.bicicletas.length);
        this.load();
      },
      error: (err) => {
        console.error("Error cargando bicicletas:", err);
        this.loading = false;
      }
    });
  }

  load() {
    this.svc.getAll().subscribe({ 
      next: d => { 
        this.ventas = d; 
        this.loading = false;
        this.cdr.detectChanges();
      }, 
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

calcularTotales() {
    this.totalGeneral = 0;
    for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
        // Convertir ambos IDs a number para comparar
        const idSeleccionado = Number(item.idBicicleta);
        const bici = this.bicicletas.find(b => Number(b.idBicicleta) === idSeleccionado);
        
        if (bici && item.cantidad > 0 && idSeleccionado !== 0) {
            this.subtotales[i] = bici.precioLista * item.cantidad;
        } else {
            this.subtotales[i] = 0;
        }
        this.totalGeneral += this.subtotales[i];
    }
    this.cdr.detectChanges();
}

  filtrar() {
    const ahora = Date.now();
    if (ahora - this.ultimoClick < 500) {
      return;
    }
    this.ultimoClick = ahora;

    if (!this.searchDoc) { 
      this.load(); 
      return; 
    }
    this.loading = true;
    this.svc.getByCliente(this.searchDoc).subscribe({
      next: d => { 
        this.ventas = d; 
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { 
        this.ventas = []; 
        this.showToast('No se encontraron ventas', 'error'); 
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  verDetalle(id: number) {
    this.svc.getById(id).subscribe({ 
      next: d => { 
        this.selectedVenta = d; 
        this.detailModalOpen = true;
        this.cdr.detectChanges();
      }, 
      error: () => this.showToast('Error al cargar detalle', 'error') 
    });
  }

  buscarCliente() {
    const ahora = Date.now();
    if (ahora - this.ultimoClick < 500) {
      return;
    }
    this.ultimoClick = ahora;

    if (!this.docCliente) return;
    this.cliSvc.getClienteByDocumento(this.docCliente).subscribe({
      next: (d: Cliente) => { 
        this.clienteEncontrado = d; 
        this.showToast(`Cliente: ${d.nombre}`, 'success');
        this.cdr.detectChanges();
      },
      error: () => { 
        this.clienteEncontrado = null; 
        this.showToast('Cliente no encontrado', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  addItem() { 
    this.items.push({ idBicicleta: 0, cantidad: 1 }); 
    this.subtotales.push(0);
    this.calcularTotales();
  }
  
  removeItem(i: number) { 
    this.items.splice(i, 1); 
    this.subtotales.splice(i, 1);
    this.calcularTotales();
  }

  getBici(id: number) { 
    return this.bicicletas.find(b => b.idBicicleta === id); 
  }

  getSubtotal(item: { idBicicleta: number; cantidad: number }) {
    const b = this.getBici(item.idBicicleta);
    return b ? Number(b.precioLista) * item.cantidad : 0;
  }

  getTotal() { 
    return this.items.reduce((t, i) => t + this.getSubtotal(i), 0); 
  }

  registrar() {
    const ahora = Date.now();
    if (ahora - this.ultimoClick < 1000) {
      console.log('Click ignorado - muy rápido');
      return;
    }
    this.ultimoClick = ahora;

    if (!this.clienteEncontrado) { 
      this.showToast('Verifique el cliente primero', 'error'); 
      return; 
    }
    if (this.items.some(i => i.idBicicleta === 0)) { 
      this.showToast('Seleccione bicicleta en todos los ítems', 'error'); 
      return; 
    }

    this.svc.create({ documentoCliente: this.docCliente, items: this.items }).subscribe({
      next: () => {
        this.showToast('Venta registrada con éxito', 'success');
        this.newModalOpen = false;
        this.load();
        this.docCliente = '';
        this.clienteEncontrado = null;
        this.items = [{ idBicicleta: 0, cantidad: 1 }];
        this.subtotales = [0];
        this.totalGeneral = 0;
        this.cdr.detectChanges();
      },
      error: () => this.showToast('Error. Verifique el stock disponible.', 'error')
    });
  }

  formatFecha(f: any) {
    if (!f) return '-';
    if (Array.isArray(f)) { 
      const [y, m, d] = f; 
      return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`; 
    }
    if (typeof f === 'string') {
      const date = new Date(f);
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    }
    return String(f);
  }

  formatPrice(p: any) { 
    return Number(p || 0).toLocaleString('es-CO'); 
  }

  showToast(msg: string, type: 'success' | 'error') { 
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    this.toast = { msg, type };
    this.cdr.detectChanges();
    
    this.timeoutId = setTimeout(() => {
      this.toast = null;
      this.cdr.detectChanges();
      this.timeoutId = null;
    }, 3000);
  }

  abrirModalNuevaVenta() {
  this.newModalOpen = true;
  this.docCliente = '';
  this.clienteEncontrado = null;
  this.items = [{ idBicicleta: 0, cantidad: 1 }];
  this.subtotales = [0];
  this.totalGeneral = 0;
}

cerrarModalNuevaVenta() {
  this.newModalOpen = false;
}

cerrarModalDetalle() {
  this.detailModalOpen = false;
}

resetFiltro() {
  this.searchDoc = '';
  this.load();
}
}