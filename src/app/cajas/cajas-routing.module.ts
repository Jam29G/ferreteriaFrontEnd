import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { HomeCajasComponent } from './pages/home-cajas/home-cajas.component';
import { GestionCajaComponent } from './pages/gestion-caja/gestion-caja.component';
import { AprobCajasComponent } from './pages/aprob-cajas/aprob-cajas.component';
import { RegistroCajasComponent } from './pages/registro-cajas/registro-cajas.component';
import { AuthGerenteGuard } from '../auth/guards/auth-gerente.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeCajasComponent,
    children: [
      {
        path: 'registros',
        component: RegistroCajasComponent,
        canActivate: [AuthGerenteGuard, AuthGerenteGuard],
        canLoad: [AuthGerenteGuard, AuthGerenteGuard]
      },
      {
        path: 'gestion',
        component: GestionCajaComponent
      },
      {
        path: 'aprobaciones',
        component: AprobCajasComponent,
        canActivate: [AuthGerenteGuard],
        canLoad: [AuthGerenteGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CajasRoutingModule { }
