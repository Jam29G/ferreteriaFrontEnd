import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeVentasComponent } from './pages/home-ventas/home-ventas.component';
import { CrearVentaComponent } from './pages/crear-venta/crear-venta.component';
import { ShowVentasComponent } from './pages/show-ventas/show-ventas.component';
import { AuthRequiredGuard } from '../auth/guards/auth-required.guard';
import { AuthAdminGuard } from '../auth/guards/auth-admin.guard';

const routes: Routes = [
  {
    path: "",
    component: HomeVentasComponent,
    children: [
      {
        path: "crear",
        component: CrearVentaComponent
      },
      {
        path: "verVentas",
        component: ShowVentasComponent,
        canActivate: [AuthRequiredGuard, AuthAdminGuard],
        canLoad: [AuthRequiredGuard, AuthAdminGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
