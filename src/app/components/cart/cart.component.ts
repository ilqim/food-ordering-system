import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { Cart, Meal, Order } from '../../models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  meals: Meal[] = [];
  address = '';
  paymentType = 'cash';
  orderNote = '';
  totalPrice = 0;

  constructor(
    private cartService: CartService,
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCart();
    this.loadMeals();
  }

  loadCart() {
    this.cart = this.cartService.getCart();
    this.calculateTotal();
  }

  loadMeals() {
    this.meals = this.dataService.getMeals();
  }

  getMealById(id: string): Meal | undefined {
    return this.meals.find(meal => meal.id === id);
  }

  updateQuantity(mealId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(mealId);
    } else {
      this.cartService.updateQuantity(mealId, quantity);
      this.loadCart();
    }
  }

  removeFromCart(mealId: string) {
    this.cartService.removeFromCart(mealId);
    this.loadCart();
  }

  calculateTotal() {
    this.totalPrice = 0;
    if (this.cart && this.cart.items.length > 0) {
      this.cart.items.forEach(item => {
        const meal = this.getMealById(item.mealId);
        if (meal) {
          this.totalPrice += meal.price * item.quantity;
        }
      });
    }
  }

  placeOrder() {
    if (!this.cart || this.cart.items.length === 0) {
      alert('Sepetiniz boş!');
      return;
    }

    if (!this.address.trim()) {
      alert('Lütfen adres giriniz!');
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Sipariş oluştur
    const order: Order = {
      id: Date.now().toString(),
      customerId: currentUser.id,
      restaurantId: this.cart.items[0] ? this.getMealById(this.cart.items[0].mealId)?.restaurantId || '' : '',
      courierId: '',
      items: [...this.cart.items],
      status: 'pending',
      address: this.address,
      totalPrice: this.totalPrice,
      paymentType: this.paymentType,
      orderNote: this.orderNote,
      createdAt: new Date().toISOString()
    };

    // Siparişi kaydet
    this.dataService.addOrder(order);
    
    // Sepeti temizle
    this.cartService.clearCart();
    
    alert('Siparişiniz başarıyla verildi!');
    this.router.navigate(['/orders']);
  }

  clearCart() {
    this.cartService.clearCart();
    this.loadCart();
  }

  continueShopping() {
    this.router.navigate(['/home']);
  }
}
