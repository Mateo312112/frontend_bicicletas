import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReporteService } from '../../services/reporte.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
})
export class Reportes implements OnInit {
  ventasDia: any[] = [];
  topProductos: any[] = [];
  stock: any[] = [];
  loading = false;
  filtrando = false;
  soloStockCritico = false;
  fechaInicio = '';
  fechaFin = '';
  toast: { msg: string; type: 'success' | 'error' } | null = null;
  private timeoutId: any = null;
  private ultimoClick = 0;

  constructor(
    private svc: ReporteService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    this.filtrando = false;
    this.soloStockCritico = false;
    
    forkJoin({
      ventas: this.svc.getVentasPorDia(),
      top: this.svc.getTopProductos(),
      stock: this.svc.getStock()
    }).subscribe({
      next: (results) => {
        this.ventasDia = results.ventas || [];
        this.topProductos = results.top || [];
        this.stock = results.stock || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando reportes:', err);
        this.showToast('Error al cargar reportes', 'error');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filtrarRango() {
    const ahora = Date.now();
    if (ahora - this.ultimoClick < 500) {
      return;
    }
    this.ultimoClick = ahora;

    if (!this.fechaInicio || !this.fechaFin) {
      this.showToast('Seleccione ambas fechas', 'error');
      return;
    }
    this.loading = true;
    this.filtrando = true;
    this.svc.getVentasPorDiaRango(this.fechaInicio, this.fechaFin).subscribe({
      next: (d) => {
        this.ventasDia = d;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.showToast('Error al filtrar', 'error');
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  resetVentas() {
    const ahora = Date.now();
    if (ahora - this.ultimoClick < 500) {
      return;
    }
    this.ultimoClick = ahora;

    this.filtrando = false;
    this.fechaInicio = '';
    this.fechaFin = '';
    this.loading = true;
    this.svc.getVentasPorDia().subscribe({
      next: (d) => {
        this.ventasDia = d;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filtrarStockCritico() {
    const ahora = Date.now();
    if (ahora - this.ultimoClick < 500) {
      return;
    }
    this.ultimoClick = ahora;

    this.soloStockCritico = true;
    this.loading = true;
    this.svc.getStockCritico().subscribe({
      next: (d) => {
        this.stock = d;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  resetStock() {
    const ahora = Date.now();
    if (ahora - this.ultimoClick < 500) {
      return;
    }
    this.ultimoClick = ahora;

    this.soloStockCritico = false;
    this.loading = true;
    this.svc.getStock().subscribe({
      next: (d) => {
        this.stock = d;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
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
}