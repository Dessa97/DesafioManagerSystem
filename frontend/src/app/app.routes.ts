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
    path: 'home',
    loadComponent: () => import('./features/countries/pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'form',
    loadComponent: () => import('./features/countries/pages/form/form.component').then(m => m.FormComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'form/:id',
    loadComponent: () => import('./features/countries/pages/form/form.component').then(m => m.FormComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'list',
    loadComponent: () => import('./features/countries/pages/list/list.component').then(m => m.ListComponent),
    canActivate: [AuthGuard]
  }
];
