import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  sidebarOpen = true;

  navItems = [
    { path: '/bicicletas', label: 'Bicicletas', icon: 'bike' },
    { path: '/clientes', label: 'Clientes', icon: 'users' },
    { path: '/inventario', label: 'Inventario', icon: 'package' },
    { path: '/ventas', label: 'Ventas', icon: 'cart' },
    { path: '/reportes', label: 'Reportes', icon: 'chart' },
  ];
}
