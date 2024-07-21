import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../Auth Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.userService.login({ username: this.username, password: this.password }).subscribe({
      next: (data) => {
        this.authService.login(data.token, data.role); // Token ve rol birlikte geçiliyor
        this.router.navigate(['/drawings']).then(() => {
          window.location.reload();
        });
      },
      error: (err) => {
        console.error('Login error', err);
        alert('Login failed: ' + (err.error?.error || 'An unknown error occurred'));
      }
    });
  }
}
