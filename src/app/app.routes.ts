import { Routes } from '@angular/router';
import { BicicletasComponent } from './components/bicicletas/bicicletas';
import { ClientesComponent } from './components/clientes/clientes';
import { InventarioComponent } from './components/inventario/inventario';
import { Ventas } from './components/ventas/ventas';
import { Reportes } from './components/reportes/reportes';

export const routes: Routes = [
  { path: '', redirectTo: 'bicicletas', pathMatch: 'full' },
{ path: 'bicicletas', component: BicicletasComponent },
{ path: 'clientes', component: ClientesComponent },
{ path: 'inventario', component: InventarioComponent },
{ path: 'ventas', component: Ventas },
{ path: 'reportes', component: Reportes },
];
