// src/app/components/shared/header/header.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { User } from '../../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUser$: Observable<User | null>;
  cartItemCount$: Observable<number>;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.cartItemCount$ = new Observable(observer => {
      this.cartService.cart$.subscribe(cart => {
        observer.next(cart.items.reduce((total, item) => total + item.quantity, 0));
      });
    });
  }

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateByRole(user: User): string {
    switch (user.role) {
      case 'restaurant':
        return '/restaurant-panel';
      case 'courier':
        return '/courier-panel';
      case 'customer':
        return '/home';
      default:
        return '/home';
    }
  }
}