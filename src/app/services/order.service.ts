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

  createOrder(address: string, phone: string, notes: string, paymentType: 'cash' | 'card'): string | null {
    const currentUser = this.authService.getCurrentUser();
    const cart = this.cartService.getCart();
    
    if (!currentUser || !cart.items.length) {
      return null;
    }

    const restaurants = this.dataService.getRestaurants();
    const restaurant = restaurants.find(r => r.id === cart.restaurantId);
    
    if (!restaurant) {
      return null;
    }

    const orderItems: OrderItem[] = cart.items.map(item => ({
      mealId: item.meal.id,
      mealName: item.meal.name,
      quantity: item.quantity,
      price: item.meal.price
    }));

    const order: Order = {
      id: Date.now().toString(),
      customerId: currentUser.id,
      customerName: currentUser.name,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      items: orderItems,
      status: 'pending',
      address,
      phone,
      totalPrice: cart.totalPrice,
      orderDate: new Date(),
      notes,
      paymentType
    };

    this.dataService.saveOrder(order);
    this.cartService.clearCart();
    
    return order.id;
  }

  updateOrderStatus(orderId: string, status: Order['status'], courierId?: string): void {
    this.dataService.updateOrderStatus(orderId, status, courierId);
  }

  getOrdersByUser(userId: string): Order[] {
    return this.dataService.getOrdersByCustomer(userId);
  }

  getOrdersByRestaurant(restaurantId: string): Order[] {
    return this.dataService.getOrdersByRestaurant(restaurantId);
  }

  getOrdersByCourier(courierId: string): Order[] {
    return this.dataService.getOrdersByCourier(courierId);
  }

  getAvailableOrdersForCourier(): Order[] {
    return this.dataService.getAvailableOrdersForCourier();
  }

  assignCourierToOrder(orderId: string, courierId: string): void {
    this.updateOrderStatus(orderId, 'onTheWay', courierId);
  }
}