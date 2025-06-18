// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./components/cart/cart.component').then(m => m.CartComponent),
    canActivate: [AuthGuard],
    data: { role: 'customer' }
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./components/orders/orders.component').then(m => m.OrdersComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'courier-panel',
    loadComponent: () =>
      import('./components/courier-panel/courier-panel.component').then(m => m.CourierPanelComponent),
    canActivate: [AuthGuard],
    data: { role: 'courier' }
  },
  {
    path: 'restaurant-panel',
    loadComponent: () =>
      import('./components/restaurant-panel/restaurant-panel.component').then(m => m.RestaurantPanelComponent),
    canActivate: [AuthGuard],
    data: { role: 'restaurant' }
  },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
