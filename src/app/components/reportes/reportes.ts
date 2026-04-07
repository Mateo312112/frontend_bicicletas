import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReporteService } from '../../services/reporte.service';
import { ReporteVentaDia, ReporteTopProducto, ReporteStock } from '../../models/venta.model';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
})
export class Reportes implements OnInit {
  ventasDia: ReporteVentaDia[] = [];
  topProductos: ReporteTopProducto[] = [];
  stock: ReporteStock[] = [];
  loading = false;
  filtrando = false;
  soloStockCritico = false;
  fechaInicio = '';
  fechaFin = '';
  toast: { msg: string; type: 'success' | 'error' } | null = null;

  constructor(private svc: ReporteService) {}
  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    this.filtrando = false;
    this.soloStockCritico = false;

    this.svc.getVentasPorDia().subscribe({ next: v => this.ventasDia = v || [] });
    this.svc.getTopProductos().subscribe({ next: t => this.topProductos = t || [] });
    this.svc.getStock().subscribe({
      next: s => { this.stock = s || []; this.loading = false; },
      error: () => { this.showToast('Error al cargar reportes', 'error'); this.loading = false; }
    });
  }

  filtrarRango() {
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
      },
      error: () => {
        this.showToast('Error al filtrar', 'error');
        this.loading = false;
      },
    });
  }

  resetVentas() {
    this.filtrando = false;
    this.fechaInicio = '';
    this.fechaFin = '';
    this.loading = true;
    this.svc.getVentasPorDia().subscribe({
      next: (d) => {
        this.ventasDia = d;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  filtrarStockCritico() {
    this.soloStockCritico = true;
    this.loading = true;
    this.svc.getStockCritico().subscribe({
      next: (d) => {
        this.stock = d;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  resetStock() {
    this.soloStockCritico = false;
    this.loading = true;
    this.svc.getStock().subscribe({
      next: (d) => {
        this.stock = d;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  formatFecha(f: any) {
    if (!f) return '-';
    if (Array.isArray(f)) {
      const [y, m, d] = f;
      return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
    }
    return String(f);
  }
  formatPrice(p: any) {
    return Number(p || 0).toLocaleString('es-CO');
  }
  showToast(msg: string, type: 'success' | 'error') {
    this.toast = { msg, type };
    setTimeout(() => (this.toast = null), 4000);
  }
}
