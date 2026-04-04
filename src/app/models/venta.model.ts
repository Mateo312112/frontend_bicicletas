import { Cliente } from './cliente.model';
import { DetalleVenta } from './detalle-venta.model';

export interface Venta {
  idVenta?: number;
  cliente?: Cliente;
  fechaVenta?: any;
  totalVenta?: number;
  detallesVenta?: DetalleVenta[];
}

export interface VentaRequest {
  documentoCliente: string;
  items: { idBicicleta: number; cantidad: number }[];
}

export interface ReporteVentaDia {
  fecha: any;
  cantidadVentas: number;
  totalRecaudado: number;
}

export interface ReporteTopProducto {
  idBicicleta: number;
  marca: string;
  modelo: string;
  totalUnidadesVendidas: number;
}

export interface ReporteStock {
  idInventario: number;
  idBicicleta: number;
  codigo: string;
  marca: string;
  modelo: string;
  cantidadDisponible: number;
  stockMinimo: number;
  bajoStockMinimo: boolean;
}
