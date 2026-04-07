import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventarioService } from '../../services/inventario.service';
import { BicicletaService } from '../../services/bicicleta.service';
import { Inventario } from '../../models/inventario.model';
import { Bicicleta } from '../../models/bicicleta.model';

@Component({ selector:'app-inventario', standalone:true, imports:[CommonModule,FormsModule], templateUrl:'./inventario.html', styleUrl:'./inventario.css' })
export class InventarioComponent implements OnInit {
  inventario: any[] = [];
  bicicletas: Bicicleta[] = [];
  loading = true;
  addModalOpen = false;
  editModalOpen = false;
  editingItem: any = null;
  soloAlertas = false;
  toast: { msg:string; type:'success'|'error' } | null = null;

  addForm = { idBicicleta: '', cantidadInicial: 0, stockMinimo: 0 };
  editQuantity = 0;

  constructor(private svc: InventarioService, private biciSvc: BicicletaService) {}

  ngOnInit() {
    this.load();
    this.biciSvc.getBicicletas().subscribe((d: Bicicleta[]) => {
      this.bicicletas = d;
    });
  }

  load(alertas = false) {
    this.loading = true;
    this.soloAlertas = alertas;
    const obs = alertas ? this.svc.getAlertas() : this.svc.getAll();
    obs.subscribe({
      next: d => { this.inventario = d; this.loading = false; },
      error: () => this.loading = false
    });
  }

  openEdit(item: any) {
    this.editingItem = item;
    this.editQuantity = item.cantidadDisponible;
    this.editModalOpen = true;
  }

  saveAdd() {
    if (!this.addForm.idBicicleta || this.addForm.idBicicleta === '') {
      this.showToast('Debe seleccionar una bicicleta', 'error');
      return;
    }
    const id = Number(this.addForm.idBicicleta);
    this.svc.create(id, this.addForm.cantidadInicial, this.addForm.stockMinimo).subscribe({
      next: () => {
        this.showToast('Inventario registrado con éxito', 'success');
        this.addModalOpen = false;
        this.addForm = { idBicicleta: '', cantidadInicial: 0, stockMinimo: 0 };
        this.load();
      },
      error: () => this.showToast('Error al registrar inventario', 'error')
    });
  }

  saveEdit() {
    this.svc.updateCantidad(this.editingItem.bicicleta.idBicicleta, this.editQuantity).subscribe({
      next: () => {
        this.showToast('Cantidad actualizada', 'success');
        this.editModalOpen = false;
        this.load(this.soloAlertas);
      },
      error: () => this.showToast('Error al actualizar', 'error')
    });
  }

  isCritical(item: any) { return item.cantidadDisponible <= item.stockMinimo; }
  showToast(msg: string, type: 'success'|'error') { this.toast = {msg, type}; setTimeout(() => this.toast = null, 4000); }
}