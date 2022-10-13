import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './shared/home/home.component';
import { AuthRequiredGuard } from './auth/guards/auth-required.guard';
import { AuthGerenteGuard } from './auth/guards/auth-gerente.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthRequiredGuard],
    canLoad: [AuthRequiredGuard]
  },
  {
    path: "auth",
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: "cajas",
    loadChildren: () => import('./cajas/cajas.module').then(m => m.CajasModule),
    canActivate: [AuthRequiredGuard, AuthGerenteGuard],
    canLoad: [AuthRequiredGuard, AuthGerenteGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
