import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReporteVentaDia, ReporteTopProducto, ReporteStock } from '../models/venta.model';

const API = 'http://localhost:8080/reportes';

@Injectable({ providedIn: 'root' })
export class ReporteService {
  constructor(private http: HttpClient) {}

  getVentasPorDia(): Observable<ReporteVentaDia[]> { return this.http.get<ReporteVentaDia[]>(`${API}/ventas-por-dia`); }
  getVentasPorDiaRango(inicio: string, fin: string): Observable<ReporteVentaDia[]> {
    return this.http.get<ReporteVentaDia[]>(`${API}/ventas-por-dia/rango?inicio=${inicio}&fin=${fin}`);
  }
  getTopProductos(): Observable<ReporteTopProducto[]> { return this.http.get<ReporteTopProducto[]>(`${API}/top-productos`); }
  getStock(): Observable<ReporteStock[]> { return this.http.get<ReporteStock[]>(`${API}/stock`); }
  getStockCritico(): Observable<ReporteStock[]> { return this.http.get<ReporteStock[]>(`${API}/stock/critico`); }
}
