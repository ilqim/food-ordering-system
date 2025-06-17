import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Order, User, Meal } from '../../models';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  currentUser: User | null = null;
  meals: Meal[] = [];
  restaurants: User[] = [];

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadData();
  }

  loadData(): void {
    this.meals = this.dataService.getMeals();
    this.restaurants = this.dataService.getUsers().filter(u => u.role === 'restaurant');
    
    if (this.currentUser?.role === 'customer') {
      this.orders = this.dataService.getOrders().filter(order => order.customerId === this.currentUser?.id);
    } else {
      this.orders = this.dataService.getOrders();
    }
  }

  getMealName(mealId: string): string {
    const meal = this.meals.find(m => m.id === mealId);
    return meal ? meal.name : 'Bilinmeyen Ürün';
  }

  getRestaurantName(restaurantId: string): string {
    const restaurant = this.restaurants.find(r => r.id === restaurantId);
    return restaurant ? restaurant.username : 'Bilinmeyen Restoran';
  }

  getOrderTotal(order: Order): number {
    return order.items.reduce((total, item) => {
      const meal = this.meals.find(m => m.id === item.mealId);
      return total + (meal ? meal.price * item.quantity : 0);
    }, 0);
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Bekliyor',
      'inProgress': 'Hazırlanıyor',
      'readyForDelivery': 'Teslimat İçin Hazır',
      'onTheWay': 'Yolda',
      'delivered': 'Teslim Edildi'
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'pending': 'status-pending',
      'inProgress': 'status-progress',
      'readyForDelivery': 'status-ready',
      'onTheWay': 'status-ontheway',
      'delivered': 'status-delivered'
    };
    return statusClasses[status] || '';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR') + ' ' + date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  }
}