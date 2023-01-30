import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './shared/home/home.component';
import { AuthRequiredGuard } from './auth/guards/auth-required.guard';
import { AuthGerenteGuard } from './auth/guards/auth-gerente.guard';
import { AuthAdminGuard } from './auth/guards/auth-admin.guard';

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
    canActivate: [AuthRequiredGuard],
    canLoad: [AuthRequiredGuard]
  },
  {
    path: "usuarios",
    loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule),
    canActivate: [AuthRequiredGuard, AuthAdminGuard],
    canLoad: [AuthRequiredGuard, AuthAdminGuard]
  },
  {
    path: "empresas",
    loadChildren: () => import('./empresas/empresas.module').then(m => m.EmpresasModule),
    canActivate: [AuthRequiredGuard, AuthGerenteGuard],
    canLoad: [AuthRequiredGuard, AuthGerenteGuard]
  },
  {
    path: "productos",
    loadChildren: () => import('./productos/productos.module').then(m => m.ProductosModule),
    canActivate: [AuthRequiredGuard],
    canLoad: [AuthRequiredGuard]
  },
  {
    path: "compras",
    loadChildren: () => import('./compras/compras.module').then(m => m.ComprasModule),
    canActivate: [AuthRequiredGuard, AuthGerenteGuard],
    canLoad: [AuthRequiredGuard, AuthGerenteGuard]
  },
  {
    path: "ventas",
    loadChildren: () => import('./ventas/ventas.module').then(m => m.VentasModule),
    canActivate: [AuthRequiredGuard],
    canLoad: [AuthRequiredGuard]
  },
  {
    path: "inventario",
    loadChildren: () => import("./inventario/inventario.module").then(m => m.InventarioModule),
    canActivate: [AuthRequiredGuard],
    canLoad: [AuthRequiredGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
