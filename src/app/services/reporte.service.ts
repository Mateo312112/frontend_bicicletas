import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API = 'http://localhost:8080/api/reportes';

@Injectable({ providedIn: 'root' })
export class ReporteService {
  constructor(private http: HttpClient) {}

  getVentasPorDia(): Observable<any[]> { 
    return this.http.get<any[]>(`${API}/ventas-por-dia`); 
  }
  
  getVentasPorDiaRango(inicio: string, fin: string): Observable<any[]> {
    return this.http.get<any[]>(`${API}/ventas-por-dia/rango?inicio=${inicio}&fin=${fin}`);
  }
  
  getTopProductos(): Observable<any[]> { 
    return this.http.get<any[]>(`${API}/top-productos`); 
  }
  
  getStock(): Observable<any[]> { 
    return this.http.get<any[]>(`${API}/stock`); 
  }
  
  getStockCritico(): Observable<any[]> { 
    return this.http.get<any[]>(`${API}/stock/critico`); 
  }
}