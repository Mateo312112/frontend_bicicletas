import { Routes } from '@angular/router';
import { ClientesComponent } from './components/clientes/clientes';
import { BicicletasComponent } from './components/bicicletas/bicicletas';
import { DetalleVentaComponent } from './components/detalle-venta/detalle-venta';
import { Inventario } from './components/inventario/inventario';
import { Ventas } from './components/ventas/ventas';
import { Reportes } from './components/reportes/reportes';

export const routes: Routes = [
  { path: '', redirectTo: 'clientes', pathMatch: 'full' },
  { path: 'clientes', component: ClientesComponent },
  { path: 'bicicletas', component: BicicletasComponent },
  { path: 'detalle-venta', component: DetalleVentaComponent },
  { path: 'inventario', component: Inventario },
  { path: 'ventas', component: Ventas },
  { path: 'reportes', component: Reportes }
];
