import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../layout/navbar/navbar';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [Navbar],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {

  user: any;

  constructor(
    private auth: Auth,
  ) {}

  ngOnInit(): void {

    this.loadProfile();

  }

  loadProfile(): void {

    this.auth.getProfile().subscribe({

      next: (response) => {

        this.user = response.user;

      },

      error: () => {

        this.auth.logout();

      }

    });

  }

}