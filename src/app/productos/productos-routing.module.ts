import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeProductosComponent } from './pages/home-productos/home-productos.component';
import { UbicacionesComponent } from './pages/ubicaciones/ubicaciones.component';
import { AdmProductosComponent } from './pages/adm-productos/adm-productos.component';

const routes: Routes = [
  {
    path: "",
    component: HomeProductosComponent,
    children: [
      {
        path: "ubicaciones",
        component: UbicacionesComponent
      },
      {
        path: "adm",
        component: AdmProductosComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosRoutingModule { }
