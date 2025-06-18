// src/app/components/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  // Demo kullanıcıları
  demoUsers = [
    { username: 'admin', password: 'admin123', role: 'Admin' },
    { username: 'restoran1', password: 'rest123', role: 'Restoran' },
    { username: 'kurye1', password: 'kurye123', role: 'Kurye' },
    { username: 'musteri1', password: 'musteri123', role: 'Müşteri' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Eğer zaten giriş yapmışsa ana sayfaya yönlendir
    if (this.authService.isLoggedIn()) {
      this.redirectToHomePage();
    }
  }

  login(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Kullanıcı adı ve şifre gereklidir.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Gerçek uygulamada burada async işlem olurdu
    setTimeout(() => {
      const success = this.authService.login(this.username, this.password);
      
      if (success) {
        this.redirectToHomePage();
      } else {
        this.errorMessage = 'Geçersiz kullanıcı adı veya şifre!';
      }
      
      this.isLoading = false;
    }, 1000);
  }

  loginWithDemo(username: string, password: string): void {
    this.username = username;
    this.password = password;
    this.login();
  }

  private redirectToHomePage(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      switch (user.role) {
        case 'restaurant':
          this.router.navigate(['/restaurant-panel']);
          break;
        case 'courier':
          this.router.navigate(['/courier-panel']);
          break;
        case 'customer':
        case 'admin':
        default:
          this.router.navigate(['/home']);
          break;
      }
    }
  }
}