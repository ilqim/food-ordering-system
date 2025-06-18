import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Cart, CartItem } from '../../models';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialogComponent],
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

  confirmMessage = '';
  pendingMealId: string | null = null;

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

  updateQuantity(mealId: string, quantity: number, mealName?: string): void {
    if (quantity < 1) {
      this.requestRemove(mealId, mealName);
    } else {
      this.cartService.updateQuantity(mealId, quantity);
    }
  }

  requestRemove(mealId: string, mealName?: string): void {
    this.pendingMealId = mealId;
    this.confirmMessage = `\u201C${mealName ?? ''}\u201D adlı ürünü sepetten çıkarmak istediğinizden emin misiniz?`;
  }

  onConfirm(result: boolean): void {
    if (result && this.pendingMealId) {
      this.cartService.removeFromCart(this.pendingMealId);
    }
    this.pendingMealId = null;
    this.confirmMessage = '';
  }

  clearCart(): void {
    if (confirm('Sepeti tamamen temizlemek istediğinizden emin misiniz?')) {
      this.cartService.clearCart();
    }
  }

  getTotalQuantity(): number {
    return this.cart.items.reduce((total, item) => total + item.quantity, 0);
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
