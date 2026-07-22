import { Component, OnInit, signal } from '@angular/core';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  user = signal<any>(null);
  loading = signal(true);

  constructor(private auth: Auth) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.auth.getProfile().subscribe({
      next: (response) => {
        this.user.set(response.user);
        this.loading.set(false);
      },
      error: () => {
        this.auth.logout();
      },
    });
  }
}