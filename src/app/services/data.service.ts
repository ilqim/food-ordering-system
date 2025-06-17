import { Injectable } from '@angular/core';
import { User, Meal, Order } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  constructor() {
    this.initializeData();
  }

  private initializeData() {
    if (!localStorage.getItem('users')) {
      const initialUsers: User[] = [
        {
          id: '1',
          username: 'admin',
          password: 'admin123',
          role: 'admin',
          name: 'Admin User'
        },
        {
          id: '2',
          username: 'pizza_palace',
          password: 'restaurant123',
          role: 'restaurant',
          name: 'Pizza Palace',
          restaurantName: 'Pizza Palace',
          phone: '0312 123 45 67',
          address: 'Çankaya, Ankara'
        },
        {
          id: '3',
          username: 'kurye1',
          password: 'courier123',
          role: 'courier',
          name: 'Ali Kurye',
          phone: '0532 123 45 67'
        },
        {
          id: '4',
          username: 'customer1',
          password: 'customer123',
          role: 'customer',
          name: 'Müşteri Ahmet',
          address: 'Kızılay, Ankara',
          phone: '0542 123 45 67'
        }
      ];
      
      localStorage.setItem('users', JSON.stringify(initialUsers));
    }

    if (!localStorage.getItem('meals')) {
      const initialMeals: Meal[] = [
        {
          id: '1',
          restaurantId: '2',
          name: 'Margherita Pizza',
          price: 89.90,
          description: 'Klasik domates sosu, mozzarella peyniri ve taze fesleğen',
          category: 'Pizza',
          isAvailable: true,
          preparationTime: 20
        },
        {
          id: '2',
          restaurantId: '2',
          name: 'Pepperoni Pizza',
          price: 105.90,
          description: 'Pepperoni sosisi ve mozzarella peyniri',
          category: 'Pizza',
          isAvailable: true,
          preparationTime: 22
        },
        {
          id: '3',
          restaurantId: '2',
          name: 'Karışık Pizza',
          price: 125.90,
          description: 'Sucuk, salam, mozzarella, domates, biber',
          category: 'Pizza',
          isAvailable: true,
          preparationTime: 25
        }
      ];
      
      localStorage.setItem('meals', JSON.stringify(initialMeals));
    }

    if (!localStorage.getItem('orders')) {
      localStorage.setItem('orders', JSON.stringify([]));
    }
  }

  // Users
  getUsers(): User[] {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }

  saveUsers(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  getUserById(id: string): User | undefined {
    return this.getUsers().find(user => user.id === id);
  }

  // Meals
  getMeals(): Meal[] {
    return JSON.parse(localStorage.getItem('meals') || '[]');
  }

  saveMeals(meals: Meal[]): void {
    localStorage.setItem('meals', JSON.stringify(meals));
  }

  getMealsByRestaurant(restaurantId: string): Meal[] {
    return this.getMeals().filter(meal => meal.restaurantId === restaurantId);
  }

  getMealById(id: string): Meal | undefined {
    return this.getMeals().find(meal => meal.id === id);
  }

  addMeal(meal: Meal): void {
    const meals = this.getMeals();
    meals.push(meal);
    this.saveMeals(meals);
  }

  updateMeal(updatedMeal: Meal): void {
    const meals = this.getMeals();
    const index = meals.findIndex(meal => meal.id === updatedMeal.id);
    if (index !== -1) {
      meals[index] = updatedMeal;
      this.saveMeals(meals);
    }
  }

  deleteMeal(id: string): void {
    const meals = this.getMeals().filter(meal => meal.id !== id);
    this.saveMeals(meals);
  }

  // Orders
  getOrders(): Order[] {
    return JSON.parse(localStorage.getItem('orders') || '[]');
  }

  saveOrders(orders: Order[]): void {
    localStorage.setItem('orders', JSON.stringify(orders));
  }

  addOrder(order: Order): void {
    const orders = this.getOrders();
    orders.push(order);
    this.saveOrders(orders);
  }

  updateOrder(updatedOrder: Order): void {
    const orders = this.getOrders();
    const index = orders.findIndex(order => order.id === updatedOrder.id);
    if (index !== -1) {
      orders[index] = updatedOrder;
      this.saveOrders(orders);
    }
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
    return this.getOrders().filter(order => 
      order.status === 'ready' && !order.courierId
    );
  }

  // Restaurants
  getRestaurants(): User[] {
    return this.getUsers().filter(user => user.role === 'restaurant');
  }

  // Couriers
  getCouriers(): User[] {
    return this.getUsers().filter(user => user.role === 'courier');
  }
}