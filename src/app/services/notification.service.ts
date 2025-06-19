import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messageSubject = new BehaviorSubject<string | null>(null);
  message$ = this.messageSubject.asObservable();

  private confirmSubject = new BehaviorSubject<string | null>(null);
  confirmMessage$ = this.confirmSubject.asObservable();
  private confirmResolver: ((result: boolean) => void) | null = null;

  notify(message: string): void {
    this.messageSubject.next(message);
    setTimeout(() => this.messageSubject.next(null), 3000);
  }

  confirm(message: string): Promise<boolean> {
    this.confirmSubject.next(message);
    return new Promise(resolve => {
      this.confirmResolver = resolve;
    });
  }

  resolveConfirm(result: boolean): void {
    if (this.confirmResolver) {
      this.confirmResolver(result);
    }
    this.confirmResolver = null;
    this.confirmSubject.next(null);
  }
}