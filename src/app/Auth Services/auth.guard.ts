import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
  // kullanıcının giriş yapıp yapmadığını kontrol etmek ve erişim izni vermek için gerekli metod
  canActivate(): boolean {
    if (this.isBrowser() && localStorage.getItem('token')) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
