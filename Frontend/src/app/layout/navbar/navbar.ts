import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NotificationBellComponent } from '../notification-bell/notification-bell';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NotificationBellComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

  constructor(
    private auth: Auth,
    private router: Router,
  ) {}

  logout() {

    this.auth.logout();

    this.router.navigate(['/login']);

  }

}