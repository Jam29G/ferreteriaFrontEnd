import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComprasComponent } from './pages/home-compras/home-compras.component';
import { CrearCompraComponent } from './pages/crear-compra/crear-compra.component';

const routes: Routes = [
  {
    path: "",
    component: HomeComprasComponent,
    children: [
      {
        path: "crear",
        component: CrearCompraComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprasRoutingModule { }
