import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private userService: UserService, private router: Router) {}

  onSubmit(): void {
    this.userService.login({ username: this.username, password: this.password }).subscribe({
      next: (data) => {
        localStorage.setItem('token', data.token);
        this.router.navigate(['/drawings']);
      },
      error: (err) => {
        console.error('Login error', err);
        alert('Login failed: ' + err.error.error);
      }
    });
  }
}
