<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';

import { Profile } from './pages/profile/profile';
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
import { UserListComponent } from './pages/user-list/user-list';
import { UserCreateComponent } from './pages/user-create/user-create';
import { UserEditComponent } from './pages/user-edit/user-edit';
import { UserDetailsComponent } from './pages/user-details/user-details';


import { ProjectListComponent } from './pages/project-list/project-list';
import { ProjectCreateComponent } from './pages/project-create/project-create';
import { ProjectEditComponent } from './pages/project-edit/project-edit';
import { ProjectDetailsComponent } from './pages/project-details/project-details';


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
    component: ProjectListComponent,
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
  data: { requiredRole: 'Employee' },
},
  {
    path: 'workspace/edit/:id',
    component: WorkspaceEditComponent,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'COMPANY_ADMIN' },
  },
  
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'COMPANY_ADMIN' },
  },
  {
    path: 'users/create',
    component: UserCreateComponent,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'COMPANY_ADMIN' },
  },
  {
    path: 'users/details/:id',
    component: UserDetailsComponent,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'COMPANY_ADMIN' },
  },
  {
    path: 'users/edit/:id',
    component: UserEditComponent,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'COMPANY_ADMIN' },
  },

  {
    path: 'projects',
    component: ProjectListComponent,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'EMPLOYEE' },
  },
  {
    path: 'projects/create',
    component: ProjectCreateComponent,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'PROJECT_MANAGER' },
  },
  {
    path: 'projects/details/:id',
    component: ProjectDetailsComponent,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'EMPLOYEE' },
  },
  {
    path: 'projects/edit/:id',
    component: ProjectEditComponent,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'PROJECT_MANAGER' },
  },
];
=======
=======
>>>>>>> Stashed changes
// This file defines the TypeScript interfaces for project data used across the app.
export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';

export interface ProjectWorkspace {
  id: string;
  workspaceName: string;
}

export interface ProjectManagerOption {
  id: string;
  fullName: string;
}

export interface Project {
  id: string;
  projectName: string;
  description?: string;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  workspace: ProjectWorkspace;
  projectManager?: ProjectManagerOption | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  projectName: string;
  description?: string;
  workspaceId: string;
  projectManagerId?: string;
  status?: ProjectStatus;
  startDate?: string;
  endDate?: string;
}

export interface UpdateProjectRequest {
  projectName?: string;
  description?: string;
  projectManagerId?: string;
  status?: ProjectStatus;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export interface ProjectOption {
  id: string;
  projectName: string;
<<<<<<< Updated upstream
}
>>>>>>> Stashed changes
=======
}
>>>>>>> Stashed changes
