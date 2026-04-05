import { Bicicleta } from './bicicleta.model';

export interface Inventario {
  idInventario: number;
  bicicleta: Bicicleta;
  cantidadDisponible: number;
  stockMinimo: number;
}
