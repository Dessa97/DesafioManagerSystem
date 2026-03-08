import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'paises',
    loadComponent: () => import('./features/paises/pages/list/list.component').then(m => m.ListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'paises/manage',
    loadComponent: () => import('./features/paises/pages/manage/manage.component').then(m => m.ManageComponent),
    canActivate: [AuthGuard]
  }
];
