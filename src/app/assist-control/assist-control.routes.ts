import { Routes } from '@angular/router';
import AssistControlComponent from './assist-control.component';

const routes: Routes = [
  {
    path: '',
    component: AssistControlComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/register/register.component'),
      },
      {
        path: 'my-registers',
        loadComponent: () =>
          import('./pages/my-registers/my-registers.component'),
      },
    ],
  },
];

export default routes;
