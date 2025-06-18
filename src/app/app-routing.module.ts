// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./components/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./components/orders/orders.component').then(m => m.OrdersComponent)
  },
  {
    path: 'courier-panel',
    loadComponent: () =>
      import('./components/courier-panel/courier-panel.component').then(m => m.CourierPanelComponent)
  },
  {
    path: 'restaurant-panel',
    loadComponent: () =>
      import('./components/restaurant-panel/restaurant-panel.component').then(m => m.RestaurantPanelComponent)
  },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
