import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Cart, CartItem } from '../../models';
import { NotificationService } from 'src/app/services/notification.service';

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
    private router: Router,
    private notifier: NotificationService
  ) { }

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

      this.removeItem(mealId, mealName);
    } else {
      this.cartService.updateQuantity(mealId, quantity);
    }
  }
  removeItem(mealId: string, mealName?: string): void {
    this.notifier
      .confirm(`\u201C${mealName ?? ''}\u201D adlı ürünü sepetten çıkarmak istediğinizden emin misiniz?`)
      .then(result => {
        if (result) {
          this.cartService.removeFromCart(mealId);
        }
      });
  }

  clearCart(): void {
    this.notifier.confirm('Sepeti tamamen temizlemek istediğinizden emin misiniz?')
      .then(result => {
        if (result) {
          this.cartService.clearCart();
        }
      });
  }

  getTotalQuantity(): number {
    return this.cart.items.reduce((total, item) => total + item.quantity, 0);
  }

  placeOrder(): void {
    if (!this.address.trim()) {
      this.notifier.notify('Lütfen teslimat adresini girin!');
      return;
    }

    if (!this.phone.trim()) {
      this.notifier.notify('Lütfen telefon numaranızı girin!');
      return;
    }

    if (this.cart.items.length === 0) {

      this.notifier.notify('Sepetinizde ürün yok!');
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
        this.notifier.notify('Siparişiniz başarıyla verildi! Sipariş No: ' + orderId);
        this.router.navigate(['/orders']);
      } else {
        this.notifier.notify('Sipariş verilirken bir hata oluştu!');
      }

      this.isPlacingOrder = false;
    }, 1500);
  }

  continueShopping(): void {
    this.router.navigate(['/home']);
  }

  trackByMealId(index: number, item: CartItem): string {
    return item.meal?.id ?? index.toString();
  }

}
