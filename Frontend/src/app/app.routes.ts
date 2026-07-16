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

import { CompanyListComponent } from './company/pages/company-list/company-list';
import { CompanyCreateComponent } from './company/pages/company-create/company-create';
import { CompanyDetailsComponent } from './company/pages/company-details/company-details';
import { CompanyEditComponent } from './company/pages/company-edit/company-edit';

import { WorkspaceListComponent } from './pages/workspace-list/workspace-list';
import { WorkspaceCreateComponent } from './pages/workspace-create/workspace-create';
import { WorkspaceEditComponent } from './pages/workspace-edit/workspace-edit';
import { WorkspaceDetailsComponent } from './pages/workspace-details/workspace-details';

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

  // Company Routes
  {
    path: 'company',
    component: CompanyListComponent,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'EMPLOYEE' },
  },
  {
    path: 'company/create',
    component: CompanyCreateComponent,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'EMPLOYEE' },
  },
  {
    path: 'company/details/:id',
    component: CompanyDetailsComponent,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'EMPLOYEE' },
  },
  {
    path: 'company/edit/:id',
    component: CompanyEditComponent,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'EMPLOYEE' },
  },

  // Workspace Routes
  {
    path: 'workspace',
    component: WorkspaceListComponent,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'COMPANY_ADMIN' },
  },
  {
    path: 'workspace/create',
    component: WorkspaceCreateComponent,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'COMPANY_ADMIN' },
  },
  {
    path: 'workspace/details/:id',
    component: WorkspaceDetailsComponent,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'EMPLOYEE' },
  },
  {
    path: 'workspace/edit/:id',
    component: WorkspaceEditComponent,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'COMPANY_ADMIN' },
  },
];