import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Meal, User } from '../../models';
import { MealCardComponent } from '../shared/meal-card/meal-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MealCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUser: User | null = null;
  meals: Meal[] = [];
  filteredMeals: Meal[] = [];
  restaurants: User[] = [];
  selectedRestaurant = '';
  searchTerm = '';
  selectedCategory = '';
  categories = ['Hamburger', 'Pizza', 'Türk Mutfağı', 'İtalyan', 'Çin Mutfağı', 'Tatlı', 'İçecek'];
  
  constructor(
    private dataService: DataService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Müşteri değilse ilgili paneline yönlendir
    if (this.currentUser.role !== 'customer') {
      this.redirectToRolePanel();
      return;
    }

    this.loadData();
  }

  redirectToRolePanel() {
    switch (this.currentUser?.role) {
      case 'restaurant':
        this.router.navigate(['/restaurant-panel']);
        break;
      case 'courier':
        this.router.navigate(['/courier-panel']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }

  loadData() {
    this.meals = this.dataService.getMeals();
    this.restaurants = this.dataService.getUsers().filter(user => user.role === 'restaurant');
    this.filterMeals();
  }

  filterMeals() {
    this.filteredMeals = this.meals.filter(meal => {
      const matchesSearch = meal.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           meal.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesRestaurant = !this.selectedRestaurant || meal.restaurantId === this.selectedRestaurant;
      
      const matchesCategory = !this.selectedCategory || meal.category === this.selectedCategory;

      return matchesSearch && matchesRestaurant && matchesCategory;
    });
  }

  onSearchChange() {
    this.filterMeals();
  }

  onRestaurantChange() {
    this.filterMeals();
  }

  onCategoryChange() {
    this.filterMeals();
  }

  getRestaurantName(restaurantId: string): string {
    const restaurant = this.restaurants.find(r => r.id === restaurantId);
    return restaurant?.username || 'Bilinmeyen Restoran';
  }

  addToCart(meal: Meal) {
    this.cartService.addToCart(meal.id);
    // Toast notification yerine basit alert
    alert(`${meal.name} sepete eklendi!`);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToOrders() {
    this.router.navigate(['/orders']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}