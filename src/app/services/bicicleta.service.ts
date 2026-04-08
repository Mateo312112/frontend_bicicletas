import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { Bicicleta } from '../models/bicicleta.model';

@Injectable({
  providedIn: 'root',
})
export class BicicletaService {
private apiUrl = 'https://backendbicicletas-production-3e70.up.railway.app/api/bicicletas';

  constructor(private http: HttpClient) {}

  getBicicletas(): Observable<Bicicleta[]> {
    return this.http.get<Bicicleta[]>(this.apiUrl);
  }

  getBicicletaById(id: number): Observable<Bicicleta> {
    return this.http.get<Bicicleta>(`${this.apiUrl}/${id}`);
  }

  crearBicicleta(bicicleta: Bicicleta): Observable<Bicicleta> {
    return this.http.post<Bicicleta>(this.apiUrl, bicicleta);
  }

  actualizarBicicleta(id: number, bicicleta: Bicicleta): Observable<Bicicleta> {
    return this.http.put<Bicicleta>(`${this.apiUrl}/${id}`, bicicleta);
  }

  eliminarBicicleta(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
