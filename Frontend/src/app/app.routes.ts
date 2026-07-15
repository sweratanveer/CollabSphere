import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';

import { Profile } from './pages/profile/profile';
import { Projects } from './pages/projects/projects';
import { Teams } from './pages/teams/teams';
import { Tasks } from './pages/tasks/tasks';
import { Settings } from './pages/settings/settings';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'EMPLOYEE' },
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'EMPLOYEE' },
  },
  {
    path: 'projects',
    component: Projects,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'EMPLOYEE' },
  },
  {
    path: 'teams',
    component: Teams,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'EMPLOYEE' },
  },
  {
    path: 'tasks',
    component: Tasks,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'EMPLOYEE' },
  },
  {
    path: 'settings',
    component: Settings,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'EMPLOYEE' },
  },
];