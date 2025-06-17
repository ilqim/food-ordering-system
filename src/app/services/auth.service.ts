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
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
    this.initializeDefaultUsers();
  }

  private initializeDefaultUsers() {
    const users = this.getUsers();
    if (users.length === 0) {
      const defaultUsers: User[] = [
        {
          id: '1',
          username: 'admin',
          password: 'admin123',
          role: 'admin',
          name: 'Admin User'
        },
        {
          id: '2',
          username: 'pizza_palace',
          password: 'restaurant123',
          role: 'restaurant',
          name: 'Pizza Palace',
          restaurantName: 'Pizza Palace',
          phone: '0532 123 45 67'
        },
        {
          id: '3',
          username: 'burger_king',
          password: 'restaurant123',
          role: 'restaurant',
          name: 'Burger King',
          restaurantName: 'Burger King',
          phone: '0532 234 56 78'
        },
        {
          id: '4',
          username: 'courier1',
          password: 'courier123',
          role: 'courier',
          name: 'Ahmet Kurye',
          phone: '0533 345 67 89'
        },
        {
          id: '5',
          username: 'customer1',
          password: 'customer123',
          role: 'customer',
          name: 'Mehmet Müşteri',
          phone: '0534 456 78 90',
          address: 'Çankaya, Ankara'
        }
      ];
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
  }

  login(username: string, password: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
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
    const exists = users.some(u => u.username === user.username);
    
    if (!exists) {
      const newUser: User = {
        ...user,
        id: Date.now().toString()
      };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      return true;
    }
    return false;
  }
}