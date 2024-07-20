import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule] 
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  role: string = 'user';  // Varsayılan değer

  constructor(private userService: UserService, private router: Router) {}

  onSubmit(): void {
    this.userService.register({ username: this.username, password: this.password, role: this.role }).subscribe(data => {
      this.router.navigate(['/login']);
    });
  }
}
