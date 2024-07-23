import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000'; // API ana URL'si

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: { username: string; password: string }): Observable<{ token: string, role: string }> {
    return this.http.post<{ token: string, role: string }>(`${this.apiUrl}/login`, credentials);
  }
}
