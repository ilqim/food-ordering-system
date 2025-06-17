import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { User } from '../../../models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  cartItemCount = 0;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.cartService.cart$.subscribe(cart => {
      this.cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToHome() {
    if (this.currentUser) {
      switch (this.currentUser.role) {
        case 'customer':
          this.router.navigate(['/home']);
          break;
        case 'restaurant':
          this.router.navigate(['/restaurant-panel']);
          break;
        case 'courier':
          this.router.navigate(['/courier-panel']);
          break;
        default:
          this.router.navigate(['/home']);
      }
    }
  }

  navigateToCart() {
    this.router.navigate(['/cart']);
  }

  navigateToOrders() {