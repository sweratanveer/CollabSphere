import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {

  email = '';

  password = '';

  loading = false;

  error = '';

  constructor(
    private auth: Auth,
    private router: Router,
  ) {}

  login() {

    this.loading = true;

    this.error = '';

    this.auth.login({

      email: this.email,

      password: this.password,

    }).subscribe({

      next: (response: any) => {

        this.auth.saveToken(
          response.accessToken,
        );

        this.router.navigate([
          '/dashboard',
        ]);

      },

      error: () => {

        this.loading = false;

        this.error =
          'Invalid Email or Password';

      },

      complete: () => {

        this.loading = false;

      },

    });

  }

}
