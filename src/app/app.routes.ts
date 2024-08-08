import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'assist-control',
    pathMatch: 'full',
  },
  {
    path: 'assist-control',
    canActivate: [authGuard],
    loadComponent: () => import('./assist-control/assist-control.component'),
  },
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.component'),
  },
  {
    path: '**',
    redirectTo: 'assist-control',
  },
];
