// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from '../app/views/pages/auth/login/login.component';
// Components
import { BaseComponent } from './views/theme/base/base.component';
import { ErrorPageComponent } from './views/theme/content/error-page/error-page.component';
// Auth
import { AuthGuard } from './core/auth';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('../app/views/pages/auth/auth.module').then(m => m.AuthModule) },
  {
    path: '',
    component: BaseComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../app/views/pages/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'masters',
        loadChildren: () => import('../app/views/pages/masters/masters.module').then(m => m.MastersModule)
      },
      {
        path: 'user-management',
        loadChildren: () => import('../app/views/pages/user-management/user-management.module').then(m => m.UserManagementModule)
      },
      {
        path: 'userprofile',
        loadChildren: () => import('../app/views/pages/userprofile/userprofile.module').then(m => m.UserProfileModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('../app/views/pages/reports/reports.module').then(m => m.ReportsModule)
      },
      {
        path: 'error/403',
        component: ErrorPageComponent,
        data: {
          type: 'error-v6',
          code: 403,
          title: '403... Access forbidden',
          desc: 'Looks like you don\'t have permission to access for requested page.<br>Please, contact administrator'
        }
      },
      { path: 'error/:type', component: ErrorPageComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'error/403', pathMatch: 'full' },
  { path: '', loadChildren: () => import('../app/views/pages/auth/auth.module').then(m => m.AuthModule) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: false, enableTracing: false, paramsInheritanceStrategy: 'always' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
