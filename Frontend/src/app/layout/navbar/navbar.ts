import { Component, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { Auth } from '../../services/auth';

interface NavItem {
  label: string;
  link: string;
  requiredRole: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
    imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private allNavItems: NavItem[] = [
    { label: 'Admin', link: '/admin', requiredRole: 'SUPER_ADMIN' },
    { label: 'Dashboard', link: '/dashboard', requiredRole: 'EMPLOYEE' },
    { label: 'Projects', link: '/projects', requiredRole: 'EMPLOYEE' },
    { label: 'Teams', link: '/teams', requiredRole: 'EMPLOYEE' },
    { label: 'Tasks', link: '/tasks', requiredRole: 'EMPLOYEE' },
    { label: 'Company', link: '/company', requiredRole: 'EMPLOYEE' },
    { label: 'Workspace', link: '/workspace', requiredRole: 'COMPANY_ADMIN' },
    { label: 'Users', link: '/users', requiredRole: 'COMPANY_ADMIN' },
    { label: 'Chat', link: '/chat', requiredRole: 'EMPLOYEE' },
    { label: 'Meetings', link: '/meetings', requiredRole: 'EMPLOYEE' },
    { label: 'Calendar', link: '/calendar', requiredRole: 'EMPLOYEE' },
    { label: 'Files', link: '/files', requiredRole: 'EMPLOYEE' },
    { label: 'Reports', link: '/reports', requiredRole: 'TEAM_LEADER' },
    { label: 'Subscriptions', link: '/subscriptions', requiredRole: 'COMPANY_ADMIN' },
    { label: 'Invoices', link: '/invoices', requiredRole: 'COMPANY_ADMIN' },
  ];

  visibleNavItems = computed(() =>
    this.allNavItems.filter((item) => this.auth.hasRole(item.requiredRole)),
  );

  constructor(
    public auth: Auth,
    private router: Router,
  ) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}