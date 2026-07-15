import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Auth } from '../services/auth';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const requiredRole = route.data['requiredRole'] as string | undefined;

  if (!requiredRole) {
    alert(2)
    return true;
  }

  if (auth.hasRole(requiredRole)) {
    console.log(auth)
    alert(3)
    return true;
  }
alert(4)
  auth.logout();
  router.navigate(['/login']);
  return false;
};
