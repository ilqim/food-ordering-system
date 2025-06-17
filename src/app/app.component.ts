import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/shared/header/header.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  template: `
    <div class="app-container">
      <app-header *ngIf="isAuthenticated"></app-header>
      <main class="main-content" [class.with-header]="isAuthenticated">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .main-content {
      flex: 1;
      overflow-y: auto;
      background-color: #f5f5f5;
    }
    
    .main-content.with-header {
      margin-top: 64px;
    }
  `]
})
export class AppComponent {
  title = 'food-delivery-app';
  
  constructor(public authService: AuthService) {}
  
  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}