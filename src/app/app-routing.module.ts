import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'home', 
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'cart', 
    loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'orders', 
    loadComponent: () => import('./components/orders/orders.component').then(m => m.OrdersComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'restaurant-panel', 
    loadComponent: () => import('./components/restaurant-panel/restaurant-panel.component').then(m => m.RestaurantPanelComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'courier-panel', 
    loadComponent: () => import('./components/courier-panel/courier-panel.component').then(m => m.CourierPanelComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];