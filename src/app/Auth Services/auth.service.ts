import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.getToken() !== '');
  private role = new BehaviorSubject<string>(this.getRole());

  isLoggedIn$ = this.loggedIn.asObservable();
  role$ = this.role.asObservable();

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  getToken(): string {
    return this.isBrowser() ? localStorage.getItem('token') || '' : '';
  }

  getRole(): string {
    return this.isBrowser() ? localStorage.getItem('role') || '' : '';
  }

  login(token: string, userRole: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('token', token);
      localStorage.setItem('role', userRole);
      this.loggedIn.next(true);
      this.role.next(userRole);
      console.log('Kullanıcı giriş yaptı, rol:', userRole); // Debug mesajı
    }
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      this.loggedIn.next(false);
      this.role.next('');
    }
  }

  isAdmin(): boolean {
    return this.role.getValue() === 'admin';
  }
}
