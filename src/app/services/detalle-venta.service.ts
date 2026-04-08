import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DetalleVenta } from '../models/detalle-venta.model';

@Injectable({
  providedIn: 'root',
})
export class DetalleVentaService {
private apiUrl = 'https://backendbicicletas-production-3e70.up.railway.app/api/detalles-ventas';
  constructor(private http: HttpClient) {}

  getDetalles(): Observable<DetalleVenta[]> {
    return this.http.get<DetalleVenta[]>(this.apiUrl);
  }

  getDetalleById(id: number): Observable<DetalleVenta> {
    return this.http.get<DetalleVenta>(`${this.apiUrl}/${id}`);
  }

  crearDetalle(detalle: DetalleVenta): Observable<DetalleVenta> {
    return this.http.post<DetalleVenta>(this.apiUrl, detalle);
  }
}
