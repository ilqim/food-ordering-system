import { Injectable } from '@angular/core';
import { Meal, Order, User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor() {
    this.initializeDefaultMeals();
  }

  private initializeDefaultMeals(): void {
    const meals = this.getMeals();
    if (meals.length === 0) {
      const defaultMeals: Meal[] = [
        {
          id: '1',
          restaurantId: '2',
          name: 'Adana Kebap',
          price: 45,
          description: 'Özel baharatlarla hazırlanmış nefis Adana kebap',
          category: 'Ana Yemek',
          available: true
        },
        {
          id: '2',
          restaurantId: '2',
          name: 'Lahmacun',
          price: 12,
          description: 'İnce hamur üzerine özel karışım',
          category: 'Ana Yemek',
          available: true
        },
        {
          id: '3',
          restaurantId: '2',
          name: 'Mercimek Çorbası',
          price: 15,
          description: 'Ev yapımı mercimek çorbası',
          category: 'Çorba',
          available: true
        },
        {
          id: '4',
          restaurantId: '2',
          name: 'Baklava',
          price: 25,
          description: 'Antep fıstıklı özel baklava',
          category: 'Tatlı',
          available: true
        }
      ];
      localStorage.setItem('meals', JSON.stringify(defaultMeals));
    }
  }

  // Meal operations
  getMeals(): Meal[] {
    const meals = localStorage.getItem('meals');
    return meals ? JSON.parse(meals) : [];
  }

  getMealsByRestaurant(restaurantId: string): Meal[] {
    return this.getMeals().filter(meal => meal.restaurantId === restaurantId);
  }

  getMealById(id: string): Meal | undefined {
    return this.getMeals().find(meal => meal.id === id);
  }

  saveMeal(meal: Meal): void {
    const meals = this.getMeals();
    const index = meals.findIndex(m => m.id === meal.id);
    
    if (index >= 0) {
      meals[index] = meal;
    } else {
      meals.push(meal);
    }
    
    localStorage.setItem('meals', JSON.stringify(meals));
  }

  deleteMeal(id: string): void {
    const meals = this.getMeals().filter(meal => meal.id !== id);
    localStorage.setItem('meals', JSON.stringify(meals));
  }

  // Order operations
  getOrders(): Order[] {
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
  }

  getOrdersByCustomer(customerId: string): Order[] {
    return this.getOrders().filter(order => order.customerId === customerId);
  }

  getOrdersByRestaurant(restaurantId: string): Order[] {
    return this.getOrders().filter(order => order.restaurantId === restaurantId);
  }

  getOrdersByCourier(courierId: string): Order[] {
    return this.getOrders().filter(order => order.courierId === courierId);
  }

  getAvailableOrdersForCourier(): Order[] {
    return this.getOrders().filter(order => order.status === 'readyForDelivery' && !order.courierId);
  }

  saveOrder(order: Order): void {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === order.id);
    
    if (index >= 0) {
      orders[index] = order;
    } else {
      orders.push(order);
    }
    
    localStorage.setItem('orders', JSON.stringify(orders));
  }

  updateOrderStatus(orderId: string, status: Order['status'], courierId?: string): void {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
      order.status = status;
      if (courierId) {
        order.courierId = courierId;
        const users = this.getUsers();
        const courier = users.find(u => u.id === courierId);
        if (courier) {
          order.courierName = courier.name;
        }
      }
      localStorage.setItem('orders', JSON.stringify(orders));
    }
  }

  // User operations
  getUsers(): User[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  getRestaurants(): User[] {
    return this.getUsers().filter(user => user.role === 'restaurant');
  }
}