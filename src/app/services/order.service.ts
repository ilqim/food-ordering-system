import { Injectable } from '@angular/core';
import { Order, OrderItem } from '../models';
import { DataService } from './data.service';
import { AuthService } from './auth.service';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  createOrder(address: string, phone: string, notes?: string, paymentMethod: 'cash' | 'card' = 'cash'): string | null {
    const user = this.authService.getCurrentUser();
    const cart = this.cartService.getCart();

    if (!user || cart.items.length === 0) {
      return null;
    }

    const restaurants = this.dataService.getRestaurants();
    const restaurant = restaurants.find(r => r.id === cart.restaurantId);

    if (!restaurant) {
      return null;
    }

    const orderItems: OrderItem[] = cart.items.map(item => ({
      mealId: item.mealId,
      mealName: item.mealName,
      quantity: item.quantity,
      price: item.price
    }));

    const order: Order = {
      id: Date.now().toString(),
      customerId: user.id,
      customerName: user.name || user.username,
      restaurantId: cart.restaurantId!,
      restaurantName: restaurant.restaurantName || restaurant.name || restaurant.username,
      items: orderItems,
      status: 'pending',
      address,
      phone,
      totalPrice: cart.totalPrice,
      orderDate: new Date(),
      notes,
      paymentMethod
    };

    this.dataService.saveOrder(order);
    this.cartService.clearCart();
    
    return order.id;
  }

  updateOrderStatus(orderId: string, status: Order['status'], courierId?: string): boolean {
    try {
      this.dataService.updateOrderStatus(orderId, status, courierId);
      return true;
    } catch (error) {
      return false;
    }
  }

  assignCourierToOrder(orderId: string, courierId: string): boolean {
    return this.updateOrderStatus(orderId, 'onTheWay', courierId);
  }
}