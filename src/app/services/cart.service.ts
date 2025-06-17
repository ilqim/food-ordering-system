import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models';

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
    const saved = localStorage.getItem('cart');
    if (saved) {
      const cart = JSON.parse(saved);
      this.cartSubject.next(cart);
    }
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartSubject.value));
  }

  addToCart(item: Omit<CartItem, 'quantity'>): void {
    const cart = this.cartSubject.value;
    
    // Farklı restorandan ürün eklenmek istenirse sepeti temizle
    if (cart.restaurantId && cart.restaurantId !== item.restaurantId) {
      this.clearCart();
    }

    const existingItem = cart.items.find(i => i.mealId === item.mealId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ ...item, quantity: 1 });
    }

    cart.restaurantId = item.restaurantId;
    this.updateTotalPrice();
  }

  removeFromCart(mealId: string): void {
    const cart = this.cartSubject.value;
    cart.items = cart.items.filter(item => item.mealId !== mealId);
    
    if (cart.items.length === 0) {
      cart.restaurantId = undefined;
    }
    
    this.updateTotalPrice();
  }

  updateQuantity(mealId: string, quantity: number): void {
    const cart = this.cartSubject.value;
    const item = cart.items.find(i => i.mealId === mealId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(mealId);
      } else {
        item.quantity = quantity;
        this.updateTotalPrice();
      }
    }
  }

  private updateTotalPrice(): void {
    const cart = this.cartSubject.value;
    cart.totalPrice = cart.items.reduce((total, item) => 
      total + (item.price * item.quantity), 0
    );
    this.cartSubject.next(cart);
    this.saveCart();
  }

  clearCart(): void {
    this.cartSubject.next({ items: [], totalPrice: 0 });
    localStorage.removeItem('cart');
  }

  getCart(): Cart {
    return this.cartSubject.value;
  }

  getItemCount(): number {
    return this.cartSubject.value.items.reduce((total, item) => total + item.quantity, 0);
  }
}
