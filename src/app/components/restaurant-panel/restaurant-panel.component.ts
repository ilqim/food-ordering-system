import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User, Meal, Order } from '../../models';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-restaurant-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './restaurant-panel.component.html',
  styleUrls: ['./restaurant-panel.component.scss']
})
export class RestaurantPanelComponent implements OnInit {
  currentUser: User | null = null;
  activeTab: 'meals' | 'orders' = 'meals';

  // Menü yönetimi
  restaurantMeals: Meal[] = [];
  showAddMealForm = false;
  editingMeal: Meal | null = null;
  mealForm = {
    name: '',
    price: 0,
    description: '',
    image: ''
  };

  // Sipariş yönetimi
  restaurantOrders: Order[] = [];
  selectedStatus = 'all';
  customers: User[] = [];
  meals: Meal[] = [];

  orderStatuses = [
    { key: 'all', label: 'Tümü' },
    { key: 'pending', label: 'Bekliyor' },
    { key: 'inProgress', label: 'Hazırlanıyor' },
    { key: 'readyForDelivery', label: 'Teslimat İçin Hazır' },
    { key: 'onTheWay', label: 'Yolda' },
    { key: 'delivered', label: 'Teslim Edildi' }
  ];

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.role !== 'restaurant') {
      this.router.navigate(['/login']);
      return;
    }

    this.loadData();
  }

  loadData(): void {
    this.loadMeals();
    this.loadOrders();
    this.customers = this.dataService.getUsers().filter(u => u.role === 'customer');
    this.meals = this.dataService.getMeals();
  }

  loadMeals(): void {
    this.restaurantMeals = this.dataService.getMeals()
      .filter(meal => meal.restaurantId === this.currentUser?.id);
  }

  loadOrders(): void {
    this.restaurantOrders = this.dataService.getOrders()
      .filter(order => order.restaurantId === this.currentUser?.id);
  }

  // Menü Yönetimi Metodları
  saveMeal(): void {
    if (!this.mealForm.name || !this.mealForm.price) {
      this.notificationService.notify('Lütfen tüm gerekli alanları doldurun!');
      return;
    }

    if (this.mealForm.name.length > 40) {
      this.notificationService.notify('Yemek adı 40 karakterden uzun olamaz!');
      return;
    }

    if (this.mealForm.description.length > 100) {
      this.notificationService.notify('Açıklama 100 karakterden uzun olamaz!');
      return;
    }

    if (this.editingMeal) {
      // Güncelleme
      const updatedMeal: Meal = {
        ...this.editingMeal,
        name: this.mealForm.name,
        price: this.mealForm.price,
        description: this.mealForm.description,
        image: this.mealForm.image
      };
      this.dataService.saveMeal(updatedMeal);
      this.notificationService.notify('Yemek başarıyla güncellendi!');
    } else {
      // Yeni ekleme
      const newMeal: Meal = {
        id: this.generateId(),
        restaurantId: this.currentUser!.id,
        name: this.mealForm.name,
        price: this.mealForm.price,
        description: this.mealForm.description,
        image: this.mealForm.image
      };
      this.dataService.saveMeal(newMeal);
      this.notificationService.notify('Yeni yemek başarıyla eklendi!');
    }

    this.resetMealForm();
    this.loadMeals();
  }

  editMeal(meal: Meal): void {
    this.editingMeal = meal;
    this.mealForm = {
      name: meal.name,
      price: meal.price,
      description: meal.description,
      image: meal.image || ''
    };
    this.showAddMealForm = true;
  }

  async deleteMeal(mealId: string): Promise<void> {
    const meal = this.restaurantMeals.find(m => m.id === mealId);
    const mealName = meal ? meal.name : 'Bu yemek';

    const confirmed = await this.notificationService.confirm(
      `${mealName} adlı yemeği silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`
    );

    if (confirmed) {
      this.dataService.deleteMeal(mealId);
      this.loadMeals();
      this.notificationService.notify('Yemek başarıyla silindi!');
    }
  }

  cancelEdit(): void {
    this.resetMealForm();
  }

  resetMealForm(): void {
    this.mealForm = {
      name: '',
      price: 0,
      description: '',
      image: ''
    };
    this.editingMeal = null;
    this.showAddMealForm = false;
  }

  // Sipariş Yönetimi Metodları
  get filteredOrders(): Order[] {
    if (this.selectedStatus === 'all') {
      return this.restaurantOrders;
    }
    return this.restaurantOrders.filter(order => order.status === this.selectedStatus);
  }

  get pendingOrdersCount(): number {
    return this.restaurantOrders.filter(order => order.status === 'pending').length;
  }

  getOrderCountByStatus(status: string): number {
    if (status === 'all') {
      return this.restaurantOrders.length;
    }
    return this.restaurantOrders.filter(order => order.status === status).length;
  }

  async updateOrderStatus(orderId: string, newStatus: Order['status']): Promise<void> {
    const order = this.restaurantOrders.find(o => o.id === orderId);
    if (!order) return;

    // Sipariş reddetme için onay iste
    if (newStatus === 'cancelled') {
      const confirmed = await this.notificationService.confirm(
        'Bu siparişi reddetmek istediğinizden emin misiniz?'
      );
      if (!confirmed) return;
    }

    order.status = newStatus;
    this.dataService.saveOrder(order);
    this.loadOrders();

    // Durum değişikliği bildirimları
    const statusMessages: { [key: string]: string } = {
      'inProgress': 'Sipariş kabul edildi ve hazırlanmaya başlandı!',
      'readyForDelivery': 'Sipariş hazır ve teslimat için bekliyor!',
      'cancelled': 'Sipariş reddedildi.'
    };

    if (statusMessages[newStatus]) {
      this.notificationService.notify(statusMessages[newStatus]);
    }
  }

  getCustomerName(customerId: string): string {
    const customer = this.customers.find(c => c.id === customerId);
    return customer ? customer.username : 'Bilinmeyen Müşteri';
  }

  getMealName(mealId: string): string {
    const meal = this.meals.find(m => m.id === mealId);
    return meal ? meal.name : 'Bilinmeyen Ürün';
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

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}