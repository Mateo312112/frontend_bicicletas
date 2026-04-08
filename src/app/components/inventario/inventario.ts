import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventarioService } from '../../services/inventario.service';
import { BicicletaService } from '../../services/bicicleta.service';
import { Inventario } from '../../models/inventario.model';
import { Bicicleta } from '../../models/bicicleta.model';

@Component({ 
  selector: 'app-inventario', 
  standalone: true, 
  imports: [CommonModule, FormsModule], 
  templateUrl: './inventario.html', 
  styleUrl: './inventario.css' 
})
export class InventarioComponent implements OnInit {
  inventario: any[] = [];
  bicicletas: Bicicleta[] = [];
  loading = true;
  addModalOpen = false;
  editModalOpen = false;
  editingItem: any = null;
  soloAlertas = false;
  toast: { msg: string; type: 'success' | 'error' } | null = null;
  private timeoutId: any = null;
  private ultimoClick = 0;

  addForm = { idBicicleta: '', cantidadInicial: 0, stockMinimo: 0 };
  editQuantity = 0;

  constructor(
    private svc: InventarioService, 
    private biciSvc: BicicletaService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit() { 
    this.load(); 
    this.biciSvc.getBicicletas().subscribe((d: Bicicleta[]) => {
      this.bicicletas = d;
      this.cdr.detectChanges();
    });
  }

  load(alertas = false) {
    this.loading = true; 
    this.soloAlertas = alertas;
    const obs = alertas ? this.svc.getAlertas() : this.svc.getAll();
    obs.subscribe({ 
        next: d => { 
            console.log("Datos recibidos:", d);
            this.inventario = d; 
            this.loading = false;
            this.cdr.detectChanges();  // ← Fuerza actualización de la vista
        }, 
        error: () => {
            this.loading = false;
            this.cdr.detectChanges();
        } 
    });
}

  openEdit(item: any) { 
    this.editingItem = item; 
    this.editQuantity = item.cantidadDisponible; 
    this.editModalOpen = true; 
  }

  saveAdd() {
    const ahora = Date.now();
    if (ahora - this.ultimoClick < 1000) {
      console.log('Click ignorado - muy rápido');
      return;
    }
    this.ultimoClick = ahora;

    if (!this.addForm.idBicicleta) {
      this.showToast('Seleccione una bicicleta', 'error');
      return;
    }

    this.svc.create(+this.addForm.idBicicleta, this.addForm.cantidadInicial, this.addForm.stockMinimo).subscribe({
      next: () => { 
        this.showToast('Inventario registrado', 'success'); 
        this.addModalOpen = false; 
        this.addForm = { idBicicleta: '', cantidadInicial: 0, stockMinimo: 0 }; 
        this.load(); 
        this.cdr.detectChanges();
      }, 
      error: () => {
        this.showToast('Error. ¿Ya existe inventario para esa bicicleta?', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  saveEdit() {
    const ahora = Date.now();
    if (ahora - this.ultimoClick < 1000) {
      console.log('Click ignorado - muy rápido');
      return;
    }
    this.ultimoClick = ahora;

    this.svc.updateCantidad(this.editingItem.bicicleta.idBicicleta, this.editQuantity).subscribe({
      next: () => { 
        this.showToast('Cantidad actualizada', 'success'); 
        this.editModalOpen = false; 
        this.load(this.soloAlertas);
        this.cdr.detectChanges();
      }, 
      error: () => {
        this.showToast('Error al actualizar', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  isCritical(item: any) { 
    return item.cantidadDisponible <= item.stockMinimo; 
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
}