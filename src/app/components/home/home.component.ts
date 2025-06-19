// src/app/components/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { CartService } from '../../services/cart.service';
import { User, Meal } from '../../models';
import { MealCardComponent } from '../shared/meal-card/meal-card.component';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MealCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUser: User | null = null;
  restaurants: User[] = [];
  meals: Meal[] = [];
  filteredMeals: Meal[] = [];
  selectedRestaurantId: string = '';
  searchTerm: string = '';
  selectedCategory: string = '';
  categories: string[] = [];

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private cartService: CartService,
    private router: Router,
    private notifier: NotificationService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadRestaurants();
    this.loadMeals();
  }

  loadRestaurants(): void {
    this.restaurants = this.dataService.getRestaurants();
  }

  loadMeals(): void {
    this.meals = this.dataService.getMeals().filter(meal => meal.available);
    this.filteredMeals = [...this.meals];
    this.extractCategories();
  }

  extractCategories(): void {
    const categorySet = new Set<string>();
    this.meals.forEach(meal => {
      if (meal.category) {
        categorySet.add(meal.category);
      }
    });
    this.categories = Array.from(categorySet);
  }

  filterMeals(): void {
    this.filteredMeals = this.meals.filter(meal => {
      const matchesSearch = meal.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           meal.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesRestaurant = !this.selectedRestaurantId || meal.restaurantId === this.selectedRestaurantId;
      const matchesCategory = !this.selectedCategory || meal.category === this.selectedCategory;
      
      return matchesSearch && matchesRestaurant && matchesCategory;
    });
  }

  onRestaurantChange(): void {
    this.filterMeals();
  }

  onCategoryChange(): void {
    this.filterMeals();
  }

  onSearchChange(): void {
    this.filterMeals();
  }

  addToCart(meal: Meal): void {
    if (this.currentUser?.role !== 'customer') {
      this.notifier.notify('Sadece müşteriler sipariş verebilir!');
      return;
    }

    const success = this.cartService.addToCart(meal);
    if (success) {
      this.notifier.notify('Ürün sepete eklendi!');
    } else {
      this.notifier
        .confirm('Sepetinizde farklı restorandan ürünler var. Sepeti temizleyip bu ürünü eklemek istiyor musunuz?')
        .then(result => {
          if (result) {
            this.cartService.clearCart();
            this.cartService.addToCart(meal);
            this.notifier.notify('Sepet temizlendi ve ürün eklendi!');
          }
        });
    }
  }

  getRestaurantName(restaurantId: string): string {
    const restaurant = this.restaurants.find(r => r.id === restaurantId);
    return restaurant ? restaurant.name : 'Bilinmeyen Restoran';
  }

  navigateToPanel(): void {
    if (this.currentUser) {
      switch (this.currentUser.role) {
        case 'restaurant':
          this.router.navigate(['/restaurant-panel']);
          break;
        case 'courier':
          this.router.navigate(['/courier-panel']);
          break;
      }
    }
  }
}