import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { Meal } from '../models/meal.model';
import { AuthService } from './auth.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();

  constructor(
    private authService: AuthService,
    private dataService: DataService
  ) {
    this.loadCart();
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem('currentCart');
    if (savedCart) {
      this.cartSubject.next(JSON.parse(savedCart));
    }
  }

  private saveCart(cart: Cart): void {
    localStorage.setItem('currentCart', JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  addToCart(meal: Meal, quantity: number = 1): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return false;

    let cart = this.cartSubject.value;
    
    if (!cart) {
      const restaurant = this.dataService.getUserById(meal.restaurantId);
      cart = {
        userId: currentUser.id,
        restaurantId: meal.restaurantId,
        restaurantName: restaurant?.restaurantName || restaurant?.name || 'Bilinmeyen Restoran',
        items: [],
        totalPrice: 0
      };
    }

    if (cart.restaurantId && cart.restaurantId !== meal.restaurantId) {
      if (!confirm('Sepetinizde başka bir restorandan ürün var. Sepeti temizleyip yeni ürünü eklemek istiyor musunuz?')) {
        return false;
      }
      cart.items = [];
      cart.restaurantId = meal.restaurantId;
      const restaurant = this.dataService.getUserById(meal.restaurantId);
      cart.restaurantName = restaurant?.restaurantName || restaurant?.name || 'Bilinmeyen Restoran';
    }

    const existingItem = cart.items.find(item => item.meal.id === meal.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.totalPrice = existingItem.quantity * existingItem.meal.price;
    } else {
      const newItem: CartItem = {
        meal: meal,
        quantity: quantity,
        totalPrice: meal.price * quantity
      };
      cart.items.push(newItem);
    }

    cart.totalPrice = cart.items.reduce((total, item) => total + item.totalPrice, 0);
    
    this.saveCart(cart);
    return true;
  }

  removeFromCart(mealId: string): void {
    const cart = this.cartSubject.value;
    if (!cart) return;

    cart.items = cart.items.filter(item => item.meal.id !== mealId);
    cart.totalPrice = cart.items.reduce((total, item) => total + item.totalPrice, 0);
    
    if (cart.items.length === 0) {
      this.clearCart();
    } else {
      this.saveCart(cart);
    }
  }

  updateQuantity(mealId: string, quantity: number): void {
    const cart = this.cartSubject.value;
    if (!cart) return;

    const item = cart.items.find(item => item.meal.id === mealId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(mealId);
      } else {
        item.quantity = quantity;
        item.totalPrice = item.quantity * item.meal.price;
        cart.totalPrice = cart.items.reduce((total, item) => total + item.totalPrice, 0);
        this.saveCart(cart);
      }
    }
  }

  clearCart(): void {
    localStorage.removeItem('currentCart');
    this.cartSubject.next(null);
  }

  getCart(): Cart | null {
    return this.cartSubject.value;
  }

  getItemCount(): number {
    const cart = this.cartSubject.value;
    return cart ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;
  }
}