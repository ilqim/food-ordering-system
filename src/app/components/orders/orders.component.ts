import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Order, User, Meal, OrderItem } from '../../models';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';

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
  statusFilters = [
    { label: 'Tümü', value: 'all' },
    { label: 'Bekliyor', value: 'pending' },
    { label: 'Hazırlanıyor', value: 'inProgress' },
    { label: 'Teslimata Hazır', value: 'readyForDelivery' },
    { label: 'Yolda', value: 'onTheWay' },
    { label: 'Teslim Edildi', value: 'delivered' },
    { label: 'İptal', value: 'cancelled' }
  ];
  selectedStatus = 'all';
  filteredOrders: Order[] = [];

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private cartService: CartService,
    private notifier: NotificationService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadData();
    this.filterOrders(this.selectedStatus);
  }

  loadData(): void {
    this.meals = this.dataService.getMeals();
    this.restaurants = this.dataService.getUsers().filter(u => u.role === 'restaurant');
    
    if (this.currentUser?.role === 'customer') {
      this.orders = this.dataService.getOrders().filter(order => order.customerId === this.currentUser?.id);
    } else {
      this.orders = this.dataService.getOrders();
    }

    this.filterOrders(this.selectedStatus);
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

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('tr-TR') + ' ' + d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  }

  filterOrders(status: string): void {
    this.selectedStatus = status;
    if (status === 'all') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(o => o.status === status);
    }
  }

  getTotalItemCount(items: OrderItem[]): number {
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  getMealPrice(mealId: string): number {
    const meal = this.meals.find(m => m.id === mealId);
    return meal ? meal.price : 0;
  }

  getCourierName(courierId: string): string {
    const courier = this.dataService.getUsers().find(u => u.id === courierId);
    return courier ? courier.username : 'Bilinmeyen Kurye';
  }

  isStatusCompleted(step: Order['status'], current: Order['status']): boolean {
    const orderSteps: Order['status'][] = ['pending', 'inProgress', 'readyForDelivery', 'onTheWay', 'delivered'];
    return orderSteps.indexOf(current) >= orderSteps.indexOf(step);
  }

  reorderItems(order: Order): void {
    order.items.forEach(item => {
      const meal = this.meals.find(m => m.id === item.mealId);
      if (meal) {
        this.cartService.addToCart(meal, item.quantity);
      }
    });
    this.notifier.notify('Ürünler sepete eklendi');
  }

  cancelOrder(orderId: string): void {
    this.notifier
      .confirm('Siparişi iptal etmek istiyor musunuz?')
      .then(result => {
        if (result) {
          this.dataService.updateOrderStatus(orderId, 'cancelled');
          this.loadData();
          this.filterOrders(this.selectedStatus);
        }
      });
  }

  rateOrder(orderId: string): void {
    this.notifier.notify('Sipariş değerlendirme özelliği henüz uygulanmadı.');
  }

  getEmptyStateMessage(): string {
    return this.selectedStatus === 'all'
      ? 'Henüz hiç sipariş vermediniz.'
      : 'Bu durumda sipariş bulunmamaktadır.';
  }
}