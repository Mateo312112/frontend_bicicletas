import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventario } from '../models/inventario.model';

const API = 'http://localhost:8080/api/inventario';  // ← URL completa para local

@Injectable({ providedIn: 'root' })
export class InventarioService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Inventario[]> { 
    return this.http.get<Inventario[]>(API); 
  }
  
  getByBicicleta(id: number): Observable<Inventario> { 
    return this.http.get<Inventario>(`${API}/bicicleta/${id}`); 
  }
  
  getAlertas(): Observable<Inventario[]> { 
    return this.http.get<Inventario[]>(`${API}/alerta`); 
  }
  
  create(idBicicleta: number, cantidadInicial: number, stockMinimo: number): Observable<Inventario> {
    return this.http.post<Inventario>(`${API}?idBicicleta=${idBicicleta}&cantidadInicial=${cantidadInicial}&stockMinimo=${stockMinimo}`, {});
  }
  
  updateCantidad(idBicicleta: number, nuevaCantidad: number): Observable<Inventario> {
    return this.http.put<Inventario>(`${API}/bicicleta/${idBicicleta}?nuevaCantidad=${nuevaCantidad}`, {});
  }
}