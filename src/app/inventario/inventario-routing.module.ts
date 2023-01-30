import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeInventarioComponent } from './pages/home-inventario/home-inventario.component';
import { AddInventarioComponent } from './pages/add-inventario/add-inventario.component';
import { AuthGerenteGuard } from '../auth/guards/auth-gerente.guard';
import { InventarioComponent } from './pages/inventario/inventario.component';

const routes: Routes = [
  {
    path: "",
    component: HomeInventarioComponent,
    children: [
      {
        path: "addInventario",
        component: AddInventarioComponent,
        canActivate: [AuthGerenteGuard],
        canLoad: [AuthGerenteGuard]
      },
      {
        path: "inventarioView",
        component: InventarioComponent,
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
export class InventarioRoutingModule { }
