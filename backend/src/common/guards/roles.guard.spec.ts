import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RolesGuard } from './roles.guard';
import { ROLES_KEY } from '../decorators/roles.decorator';

describe('RolesGuard', () => {
  let guard: RolesGuard;

  beforeEach(() => {
    guard = new RolesGuard(new Reflector());
  });

  it('returns false when no authenticated user is present for a protected route', () => {
    const reflector = new Reflector();
    const context = {
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ user: undefined }),
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['SUPER_ADMIN']);
    jest.spyOn(Reflector.prototype, 'getAllAndOverride').mockReturnValue(['SUPER_ADMIN']);

    expect(guard.canActivate(context)).toBe(false);
  });
});
