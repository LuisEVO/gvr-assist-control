import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);

  const { data } = await inject(AuthService).session();

  return !!data.session || router.parseUrl('/auth');
};
