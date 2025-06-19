import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/shared/header/header.component';
import { ToastComponent } from './components/shared/toast/toast.component';
import { ConfirmDialogComponent } from './components/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, ToastComponent, ConfirmDialogComponent],
  template: `
     <div class="app-container">
       <app-header></app-header>
       <main class="main-content">
         <router-outlet></router-outlet>
       </main>
+      <app-toast></app-toast>
+      <app-confirm-dialog></app-confirm-dialog>
     </div>
   `,
  styles: [`
     .app-container {
       min-height: 100vh;
       background-color: #f8f9fa;
     }
     .main-content {
       padding-top: 80px;
       min-height: calc(100vh - 80px);
     }
   `]
})
export class AppComponent {
  title = 'Gelişmiş Yemek Sipariş Uygulaması';
}
