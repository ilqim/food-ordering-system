import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { Order, User, Meal } from '../../models';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  currentUser: User | null = null;
  orders: Order[] = [];
  meals: Meal[] = [];
  users: User[] = [];
  selectedTab = 'active';

  activeOrders: Order[] = [];
  completedOrders: Order[] = [];

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.role !== 'customer') {
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadData();
  }

  loadData() {
    // Sadece current user'ın siparişlerini getir
    const allOrders = this.dataService.getOrders();
    this.orders = allOrders.filter(order => order.customerId === this.currentUser?.id);
    
    this.meals = this.dataService.getMeals();
    this.users = this.dataService.getUsers();
    
    // Siparişleri durumlarına göre ayır
    this.activeOrders = this.orders.filter(order => 
      ['pending', 'inProgress', 'readyForDelivery', 'onTheWay'].includes(order.status)
    );
    
    this.completedOrders = this.orders.filter(order => 
      order.status === 'delivered'
    );

    // Tarihe göre sırala (en yeni üstte)
    this.activeOrders.sort((a, b) => 
      new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
    );
    
    this.completedOrders.sort((a, b) => 
      new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
    );
  }

  getMealById(id: string): Meal | undefined {
    return this.meals.find(meal => meal.id === id);
  }

  getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  getRestaurantName(restaurantId: string): string {
    const restaurant = this.getUserById(restaurantId);
    return restaurant?.username || 'Bilinmeyen Restoran';
  }

  getCourierName(courierId: string): string {
    if (!courierId) return 'Atanmadı';
    const courier = this.getUserById(courierId);
    return courier?.username || 'Bilinmeyen Kurye';
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Beklemede',
      'inProgress': 'Hazırlanıyor',
      'readyForDelivery': 'Teslime Hazır',
      'onTheWay': 'Yolda',
      'delivered': 'Teslim Edildi'
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: string): string {
    const classMap: { [key: string]: string } = {
      'pending': 'status-pending',
      'inProgress': 'status-progress',
      'readyForDelivery': 'status-ready',
      'onTheWay': 'status-way',
      'delivered': 'status-delivered'
    };
    return classMap[status] || '';
  }

  getStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      'pending': '⏳',
      'inProgress': '👨‍🍳',
      'readyForDelivery': '📦',
      'onTheWay': '🚗',
      'delivered': '✅'
    };
    return iconMap[status] || '📋';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  reorderItems(order: Order) {
    // Siparişi tekrar sepete ekle
    order.items.forEach(item => {
      // CartService'e ekleme mantığı burada olacak
      // Şimdilik basit alert gösterelim
    });
    alert('Ürünler sepete eklendi! Sepete gidebilirsiniz.');
    this.router.navigate(['/cart']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  refreshOrders() {
    this.loadData();
  }
}
