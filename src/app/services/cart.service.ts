import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem, Meal } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>({ items: [], totalPrice: 0 });
  public cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem('currentCart');
    if (savedCart) {
      this.cartSubject.next(JSON.parse(savedCart));
    }
  }

  private saveCart(): void {
    localStorage.setItem('currentCart', JSON.stringify(this.cartSubject.value));
  }

  addToCart(meal: Meal, quantity: number = 1): boolean {
    const currentCart = this.cartSubject.value;
    
    // Farklı restorandan ürün eklemeye izin verme
    if (currentCart.restaurantId && currentCart.restaurantId !== meal.restaurantId) {
      return false;
    }

    const existingItem = currentCart.items.find(item => item.meal.id === meal.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentCart.items.push({ meal, quantity });
    }

    currentCart.restaurantId = meal.restaurantId;
    currentCart.totalPrice = this.calculateTotal(currentCart.items);
    
    this.cartSubject.next(currentCart);
    this.saveCart();
    return true;
  }

  removeFromCart(mealId: string): void {
    const currentCart = this.cartSubject.value;
    currentCart.items = currentCart.items.filter(item => item.meal.id !== mealId);
    currentCart.totalPrice = this.calculateTotal(currentCart.items);
    
    if (currentCart.items.length === 0) {
      currentCart.restaurantId = undefined;
      currentCart.restaurantName = undefined;
    }
    
    this.cartSubject.next(currentCart);
    this.saveCart();
  }

  updateQuantity(mealId: string, quantity: number): void {
    const currentCart = this.cartSubject.value;
    const item = currentCart.items.find(item => item.meal.id === mealId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(mealId);
      } else {
        item.quantity = quantity;
        currentCart.totalPrice = this.calculateTotal(currentCart.items);
        this.cartSubject.next(currentCart);
        this.saveCart();
      }
    }
  }

  clearCart(): void {
    this.cartSubject.next({ items: [], totalPrice: 0 });
    localStorage.removeItem('currentCart');
  }

  getCart(): Cart {
    return this.cartSubject.value;
  }

  getItemCount(): number {
    return this.cartSubject.value.items.reduce((total, item) => total + item.quantity, 0);
  }

  private calculateTotal(items: CartItem[]): number {
    return items.reduce((total, item) => total + (item.meal.price * item.quantity), 0);
  }
}