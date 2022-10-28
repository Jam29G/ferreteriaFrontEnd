import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeVentasComponent } from './pages/home-ventas/home-ventas.component';
import { CrearVentaComponent } from './pages/crear-venta/crear-venta.component';

const routes: Routes = [
  {
    path: "",
    component: HomeVentasComponent,
    children: [
      {
        path: "crear",
        component: CrearVentaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
