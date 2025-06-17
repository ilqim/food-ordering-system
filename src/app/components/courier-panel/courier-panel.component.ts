import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { Order, User, Meal } from '../../models';

@Component({
  selector: 'app-courier-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './courier-panel.component.html',
  styleUrls: ['./courier-panel.component.scss']
})
export class CourierPanelComponent implements OnInit {
  currentUser: User | null = null;
  assignedOrders: Order[] = [];
  availableOrders: Order[] = [];
  meals: Meal[] = [];
  users: User[] = [];
  selectedTab = 'assigned';

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.role !== 'courier') {
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadData();
  }

  loadData() {
    const orders = this.dataService.getOrders();
    this.meals = this.dataService.getMeals();
    this.users = this.dataService.getUsers();
    
    // Kurye'ye atanan siparişler
    this.assignedOrders = orders.filter(order => 
      order.courierId === this.currentUser?.id && 
      ['readyForDelivery', 'onTheWay'].includes(order.status)
    );
    
    // Atanmayı bekleyen siparişler
    this.availableOrders = orders.filter(order => 
      order.status === 'readyForDelivery' && 
      (!order.courierId || order.courierId === '')
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

  getCustomerName(customerId: string): string {
    const customer = this.getUserById(customerId);
    return customer?.username || 'Bilinmeyen Müşteri';
  }

  acceptOrder(orderId: string) {
    if (confirm('Bu siparişi almak istiyor musunuz?')) {
      this.dataService.updateOrderStatus(orderId, 'onTheWay', this.currentUser?.id);
      this.loadData();
    }
  }

  updateOrderStatus(orderId: string, status: string) {
    const statusMessages: { [key: string]: string } = {
      'onTheWay': 'Siparişi yola çıktı olarak işaretlemek istediğinizden emin misiniz?',
      'delivered': 'Siparişi teslim edildi olarak işaretlemek istediğinizden emin misiniz?'
    };

    if (confirm(statusMessages[status])) {
      this.dataService.updateOrderStatus(orderId, status);
      this.loadData();
      
      if (status === 'delivered') {
        alert('Sipariş başarıyla teslim edildi!');
      }
    }
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

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('tr-TR');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}