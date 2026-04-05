import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentaService } from '../../services/venta.service';
import { ClienteService } from '../../services/cliente.service';
import { BicicletaService } from '../../services/bicicleta.service';
import { Venta } from '../../models/venta.model';
import { Cliente } from '../../models/cliente.model';
import { Bicicleta } from '../../models/bicicleta.model';

@Component({ selector:'app-ventas', standalone:true, imports:[CommonModule,FormsModule], templateUrl:'./ventas.html', styleUrl:'./ventas.css' })
export class Ventas implements OnInit {
  ventas: Venta[] = [];
  bicicletas: Bicicleta[] = [];
  loading = true;
  newModalOpen = false;
  detailModalOpen = false;
  selectedVenta: Venta | null = null;
  toast: { msg:string; type:'success'|'error' } | null = null;

  searchDoc = '';
  docCliente = '';
  clienteEncontrado: Cliente | null = null;
  items: { idBicicleta:number; cantidad:number }[] = [{ idBicicleta:0, cantidad:1 }];

  constructor(private svc: VentaService, private cliSvc: ClienteService, private biciSvc: BicicletaService) {}
  ngOnInit() { this.load(); this.biciSvc.getAll().subscribe(d => this.bicicletas=d); }

  load() {
    this.loading = true;
    this.svc.getAll().subscribe({ next: d => { this.ventas=d; this.loading=false; }, error: () => this.loading=false });
  }

  filtrar() {
    if (!this.searchDoc) { this.load(); return; }
    this.loading = true;
    this.svc.getByCliente(this.searchDoc).subscribe({
      next: d => { this.ventas=d; this.loading=false; },
      error: () => { this.ventas=[]; this.showToast('No se encontraron ventas','error'); this.loading=false; }
    });
  }

  verDetalle(id: number) {
    this.svc.getById(id).subscribe({ next: d => { this.selectedVenta=d; this.detailModalOpen=true; }, error: () => this.showToast('Error al cargar detalle','error') });
  }

  buscarCliente() {
    if (!this.docCliente) return;
    this.cliSvc.getByDocumento(this.docCliente).subscribe({
      next: d => { this.clienteEncontrado=d; this.showToast(`Cliente: ${d.nombre}`,'success'); },
      error: () => { this.clienteEncontrado=null; this.showToast('Cliente no encontrado','error'); }
    });
  }

  addItem() { this.items.push({ idBicicleta:0, cantidad:1 }); }
  removeItem(i: number) { this.items.splice(i,1); }

  getBici(id: number) { return this.bicicletas.find(b => b.idBicicleta === id); }
  getSubtotal(item: { idBicicleta:number; cantidad:number }) {
    const b = this.getBici(item.idBicicleta);
    return b ? Number(b.precioLista) * item.cantidad : 0;
  }
  getTotal() { return this.items.reduce((t,i)=>t+this.getSubtotal(i),0); }

  registrar() {
    if (!this.clienteEncontrado) { this.showToast('Verifique el cliente primero','error'); return; }
    if (this.items.some(i=>i.idBicicleta===0)) { this.showToast('Seleccione bicicleta en todos los ítems','error'); return; }
    this.svc.create({ documentoCliente: this.docCliente, items: this.items }).subscribe({
      next: () => {
        this.showToast('Venta registrada con éxito','success');
        this.newModalOpen=false; this.load();
        this.docCliente=''; this.clienteEncontrado=null; this.items=[{idBicicleta:0,cantidad:1}];
      },
      error: () => this.showToast('Error. Verifique el stock disponible.','error')
    });
  }

  formatFecha(f: any) {
    if (!f) return '-';
    if (Array.isArray(f)) { const [y,m,d]=f; return `${String(d).padStart(2,'0')}/${String(m).padStart(2,'0')}/${y}`; }
    return String(f);
  }
  formatPrice(p: any) { return Number(p||0).toLocaleString('es-CO'); }
  showToast(msg:string,type:'success'|'error'){this.toast={msg,type};setTimeout(()=>this.toast=null,4000);}
}
