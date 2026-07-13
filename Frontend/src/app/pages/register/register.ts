import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class Register {

  fullName = '';

  email = '';

  password = '';

  role = 'EMPLOYEE';

  loading = false;

  error = '';

  constructor(
    private auth: Auth,
    private router: Router,
  ) {}

  register() {

    this.loading = true;

    this.error = '';

    this.auth.register({

      fullName: this.fullName,

      email: this.email,

      password: this.password,

      role: this.role,

    }).subscribe({

      next: () => {

        alert('User Registered Successfully');

        this.router.navigate(['/login']);

      },

      error: (err) => {

        this.loading = false;

        this.error =
          err.error?.message ||
          'Registration Failed';

      },

      complete: () => {

        this.loading = false;

      }

    });

  }

}
