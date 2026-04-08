import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta, VentaRequest } from '../models/venta.model';

const API = '/api/ventas';

@Injectable({ providedIn: 'root' })
export class VentaService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Venta[]> { 
    return this.http.get<Venta[]>(API); 
  }
  
  getById(id: number): Observable<Venta> { 
    return this.http.get<Venta>(`${API}/${id}`); 
  }
  
  getByCliente(doc: string): Observable<Venta[]> { 
    return this.http.get<Venta[]>(`${API}/cliente/${doc}`); 
  }
  
  create(req: VentaRequest): Observable<Venta> { 
    return this.http.post<Venta>(API, req); 
  }
}