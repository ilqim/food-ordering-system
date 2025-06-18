import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.initializeDefaultUsers();
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  private initializeDefaultUsers(): void {
    const users = this.getUsers();
    if (users.length === 0) {
      const defaultUsers: User[] = [
        {
          id: '1',
          username: 'admin',
          password: 'admin123',
          role: 'admin',
          name: 'Admin User',
          email: 'admin@foodapp.com'
        },
        {
          id: '2',
          username: 'restoran1',
          password: 'rest123',
          role: 'restaurant',
          name: 'Lezzet Restoran',
          email: 'info@lezzet.com',
          phone: '0212-555-0001'
        },
        {
          id: '3',
          username: 'kurye1',
          password: 'kurye123',
          role: 'courier',
          name: 'Ahmet Kurye',
          email: 'ahmet@kurye.com',
          phone: '0532-555-0001'
        },
        {
          id: '4',
          username: 'musteri1',
          password: 'musteri123',
          role: 'customer',
          name: 'Fatma Müşteri',
          email: 'fatma@email.com',
          phone: '0533-555-0001',
          address: 'Ankara Çankaya'
        }
      ];
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
  }

  login(username: string, password: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      this.currentUserSubject.next(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  private getUsers(): User[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  register(user: Omit<User, 'id'>): boolean {
    const users = this.getUsers();
    const existingUser = users.find(u => u.username === user.username);
    
    if (existingUser) {
      return false;
    }

    const newUser: User = {
      ...user,
      id: Date.now().toString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  }
}