import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeProductosComponent } from './pages/home-productos/home-productos.component';
import { UbicacionesComponent } from './pages/ubicaciones/ubicaciones.component';

const routes: Routes = [
  {
    path: "",
    component: HomeProductosComponent,
    children: [
      {
        path: "ubicaciones",
        component: UbicacionesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosRoutingModule { }
