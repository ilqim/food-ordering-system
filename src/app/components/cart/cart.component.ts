// src/app/components/cart/cart.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Cart, CartItem } from '../../models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: Cart = { items: [], totalPrice: 0 };
  
  // Sipariş formu
  address: string = '';
  phone: string = '';
  notes: string = '';
  paymentType: 'cash' | 'card' = 'cash';
  
  isPlacingOrder = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });

    // Kullanıcı bilgilerini doldur
    const user = this.authService.getCurrentUser();
    if (user) {
      this.address = user.address || '';
      this.phone = user.phone || '';
    }
  }

  updateQuantity(mealId: string, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(mealId);
    } else {
      this.cartService.updateQuantity(mealId, quantity);
    }
  }

  removeItem(mealId: string): void {
    this.cartService.removeFromCart(mealId);
  }

  clearCart(): void {
    if (confirm('Sepeti tamamen temizlemek istediğinizden emin misiniz?')) {
      this.cartService.clearCart();
    }
  }

  placeOrder(): void {
    if (!this.address.trim()) {
      alert('Lütfen teslimat adresini girin!');
      return;
    }

    if (!this.phone.trim()) {
      alert('Lütfen telefon numaranızı girin!');
      return;
    }

    if (this.cart.items.length === 0) {
      alert('Sepetinizde ürün yok!');
      return;
    }

    this.isPlacingOrder = true;

    // Gerçek uygulamada async işlem
    setTimeout(() => {
      const orderId = this.orderService.createOrder(
        this.address,
        this.phone,
        this.notes,
        this.paymentType
      );

      if (orderId) {
        alert('Siparişiniz başarıyla verildi! Sipariş No: ' + orderId);
        this.router.navigate(['/orders']);
      } else {
        alert('Sipariş verilirken bir hata oluştu!');
      }

      this.isPlacingOrder = false;
    }, 1500);
  }

  continueShopping(): void {
    this.router.navigate(['/home']);
  }
}
