import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email = '';

  password = '';

  loading = false;

  error = '';

  rememberMe = false;

  showPassword = false;

  constructor(
    private auth: Auth,
    private router: Router,
  ) {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/dashboard'], {
        replaceUrl: true,
      });
    }

    const savedEmail = localStorage.getItem('rememberEmail');

    if (savedEmail) {
      this.email = savedEmail;

      this.rememberMe = true;
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.loading = true;

    this.error = '';

    this.auth
      .login({
        email: this.email,

        password: this.password,
      })
      .subscribe({
        next: (response: any) => {
          if (this.rememberMe) {
            localStorage.setItem('rememberEmail', this.email);
          } else {
            localStorage.removeItem('rememberEmail');
          }

          this.auth.saveToken(response.accessToken, this.rememberMe);

          this.router.navigate(['/dashboard'], {
            replaceUrl: true,
          });
        },

        error: () => {
          this.loading = false;

          this.error = 'Invalid Email or Password';
        },

        complete: () => {
          this.loading = false;
        },
      });
  }
}
