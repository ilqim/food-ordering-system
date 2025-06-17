import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  showTestAccounts = false;

  testAccounts = [
    { username: 'pizza_palace', password: 'restaurant123', role: 'Restoran (Pizza Palace)' },
    { username: 'burger_king', password: 'restaurant123', role: 'Restoran (Burger King)' },
    { username: 'courier1', password: 'courier123', role: 'Kurye' },
    { username: 'customer1', password: 'customer123', role: 'Müşteri' },
    { username: 'admin', password: 'admin123', role: 'Admin' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.authService.login(this.username, this.password)) {
      const user = this.authService.getCurrentUser();
      if (user) {
        switch (user.role) {
          case 'customer':
            this.router.navigate(['/home']);
            break;
          case 'restaurant':
            this.router.navigate(['/restaurant-panel']);
            break;
          case 'courier':
            this.router.navigate(['/courier-panel']);
            break;
          case 'admin':
            this.router.navigate(['/admin']);
            break;
          default:
            this.router.navigate(['/home']);
        }
      }
    } else {
      this.error = 'Kullanıcı adı veya şifre hatalı!';
    }
  }

  useTestAccount(account: any) {
    this.username = account.username;
    this.password = account.password;
    this.error = '';
  }

  toggleTestAccounts() {
    this.showTestAccounts = !this.showTestAccounts;
  }
}