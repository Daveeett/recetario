import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.default) },
  { path: 'category/:slug', loadComponent: () => import('./pages/category/category.component').then(m => m.default) },
  { path: 'recipe/:id', loadComponent: () => import('./pages/recipe-detail/recipe-detail.component').then(m => m.default) },
  { path: 'search', loadComponent: () => import('./pages/search/search.component').then(m => m.default) },
  { path: 'preferences', loadComponent: () => import('./pages/preferences/preferences.component').then(m => m.default) },
  { path: 'forum', loadComponent: () => import('./pages/forum/forum.component').then(m => m.default) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.default) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.default) },
  { path: '**', redirectTo: '' },
];