import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Meal } from 'src/app/models';
import { User } from 'src/app/models';

@Component({
  selector: 'app-meal-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './meal-card.component.html',
  styleUrl: './meal-card.component.scss'
})
export class MealCardComponent {
  @Input() meal!: Meal;
  @Input() currentUser!: User | null;
  @Input() isRestaurantView: boolean = false;
  @Input() restaurantName: string = '';
  
  @Output() addToCart = new EventEmitter<{ meal: Meal, quantity: number }>();
  @Output() editMeal = new EventEmitter<Meal>();
  @Output() deleteMeal = new EventEmitter<number>();

  quantity: number = 1;
  showEditForm: boolean = false;
  editedMeal: Meal = { id: 0, restaurantId: 0, name: '', price: 0, description: '', category: '', image: '', available: true };

  onAddToCart(): void {
    if (this.quantity > 0) {
      this.addToCart.emit({ meal: this.meal, quantity: this.quantity });
      this.quantity = 1; // Reset quantity after adding
    }
  }

  onEditMeal(): void {
    this.editedMeal = { ...this.meal };
    this.showEditForm = true;
  }

  onSaveMeal(): void {
    if (this.editedMeal.name && this.editedMeal.price > 0) {
      this.editMeal.emit(this.editedMeal);
      this.showEditForm = false;
    }
  }

  onCancelEdit(): void {
    this.showEditForm = false;
    this.editedMeal = { id: 0, restaurantId: 0, name: '', price: 0, description: '', category: '', image: '', available: true };
  }

  onDeleteMeal(): void {
    if (confirm('Bu yemeği silmek istediğinizden emin misiniz?')) {
      this.deleteMeal.emit(this.meal.id);
    }
  }

  toggleAvailability(): void {
    this.editedMeal = { ...this.meal, available: !this.meal.available};
    this.editMeal.emit(this.editedMeal);
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  isCustomer(): boolean {
    return this.currentUser?.role === 'customer';
  }

  isRestaurant(): boolean {
    return this.currentUser?.role === 'restaurant';
  }

  canManageMeal(): boolean {
    return this.isRestaurant() && this.currentUser?.id === this.meal.restaurantId;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  }
}