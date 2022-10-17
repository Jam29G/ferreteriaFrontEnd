import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmCajasComponent } from './pages/adm-cajas/adm-cajas.component';
import { HomeCajasComponent } from './pages/home-cajas/home-cajas.component';
import { GestionCajaComponent } from './pages/gestion-caja/gestion-caja.component';

const routes: Routes = [
  {
    path: '',
    component: HomeCajasComponent,
    children: [
      {
        path: 'adm',
        component: AdmCajasComponent
      },
      {
        path: 'gestion',
        component: GestionCajaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CajasRoutingModule { }
