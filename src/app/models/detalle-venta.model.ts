import { Bicicleta } from './bicicleta.model';

export interface DetalleVenta {
  idDetalle?: number;
  idVenta: number;
  bicicleta: Bicicleta;
  cantidad: number;
  precioUnitarioVenta: number;
  subtotal: number;
}
