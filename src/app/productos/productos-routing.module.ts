import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeProductosComponent } from './pages/home-productos/home-productos.component';
import { UbicacionesComponent } from './pages/ubicaciones/ubicaciones.component';
import { AdmProductosComponent } from './pages/adm-productos/adm-productos.component';
import { AdmDetalleProductoComponent } from './pages/adm-detalle-producto/adm-detalle-producto.component';
import { BuscarProductosComponent } from './pages/buscar-productos/buscar-productos.component';
import { AuthRequiredGuard } from '../auth/guards/auth-required.guard';
import { AuthGerenteGuard } from '../auth/guards/auth-gerente.guard';

const routes: Routes = [
  {
    path: "",
    component: HomeProductosComponent,
    children: [
      {
        path: "ubicaciones",
        component: UbicacionesComponent,
        canActivate: [AuthGerenteGuard],
        canLoad: [AuthGerenteGuard]
      },
      {
        path: "adm",
        component: AdmProductosComponent,
        canActivate: [AuthGerenteGuard],
        canLoad: [AuthGerenteGuard]
      },
      {
        path: "admDetalles",
        component: AdmDetalleProductoComponent,
        canActivate: [AuthGerenteGuard],
        canLoad: [AuthGerenteGuard]
      },
      {
        path: "verProductos",
        component: BuscarProductosComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosRoutingModule { }
