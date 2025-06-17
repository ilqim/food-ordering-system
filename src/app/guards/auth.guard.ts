import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user = this.authService.getCurrentUser();
    
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    // Rol bazlı erişim kontrolü
    const requiredRole = route.data['role'];
    if (requiredRole && user.role !== requiredRole) {
      // Kullanıcının rolüne göre yönlendir
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
          this.router.navigate(['/login']);
      }
      return false;
    }

    return true;
  }
}