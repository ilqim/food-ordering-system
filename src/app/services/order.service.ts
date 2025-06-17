import { Injectable } from '@angular/core';
import { Order, OrderItem } from '../models/order.model';
import { Cart } from '../models/cart.model';
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

  createOrderFromCart(cart: Cart, address: string, phone: string, paymentMethod: 'cash' | 'card', notes?: string): Order | null {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || cart.items.length === 0) return null;

    const restaurant = this.dataService.getUserById(cart.restaurantId!);
    if (!restaurant) return null;

    const orderItems: OrderItem[] = cart.items.map(item => ({
      mealId: item.meal.id,
      mealName: item.meal.name,
      quantity: item.quantity,
      price: item.meal.price,
      totalPrice: item.totalPrice
    }));

    const order: Order = {
      id: this.generateOrderId(),
      customerId: currentUser.id,
      customerName: currentUser.name || currentUser.username,
      restaurantId: cart.restaurantId!,
      restaurantName: restaurant.restaurantName || restaurant.name || 'Bilinmeyen Restoran',
      items: orderItems,
      status: 'pending',
      address: address,
      phone: phone,
      totalPrice: cart.totalPrice,
      orderDate: new Date(),
      notes: notes,
      paymentMethod: paymentMethod
    };

    this.dataService.addOrder(order);
    this.cartService.clearCart();
    
    return order;
  }

  updateOrderStatus(orderId: string, status: Order['status'], courierId?: string): boolean {
    const orders = this.dataService.getOrders();
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return false;

    order.status = status;
    
    if (courierId && status === 'on_the_way') {
      const courier = this.dataService.getUserById(courierId);
      order.courierId = courierId;
      order.courierName = courier?.name || 'Bilinmeyen Kurye';
    }

    if (status === 'delivered') {
      order.deliveryTime = new Date();
    }

    this.dataService.updateOrder(order);
    return true;
  }

  assignCourierToOrder(orderId: string, courierId: string): boolean {
    const orders = this.dataService.getOrders();
    const order = orders.find(o => o.id === orderId);
    const courier = this.dataService.getUserById(courierId);
    
    if (!order || !courier || order.status !== 'ready') return false;

    order.courierId = courierId;
    order.courierName = courier.name || 'Bilinmeyen Kurye';
    order.status = 'on_the_way';

    this.dataService.updateOrder(order);
    return true;
  }

  private generateOrderId(): string {
    return 'ORDER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}