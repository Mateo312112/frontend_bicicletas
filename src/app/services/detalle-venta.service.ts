import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DetalleVenta } from '../models/detalle-venta.model';

@Injectable({
  providedIn: 'root',
})
export class DetalleVentaService {
  private apiUrl = 'http://localhost:8080/detalles-ventas';

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
