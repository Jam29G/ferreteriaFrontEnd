import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductosRoutingModule } from './productos-routing.module';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeProductosComponent } from './pages/home-productos/home-productos.component';
import { UbicacionesComponent } from './pages/ubicaciones/ubicaciones.component';
import { CrearUbicacionComponent } from './components/crear-ubicacion/crear-ubicacion.component';
import { AdmProductosComponent } from './pages/adm-productos/adm-productos.component';
import { CrearProductoComponent } from './components/crear-producto/crear-producto.component';
import { AddProveedroComponent } from './components/add-proveedro/add-proveedro.component';
import { AddUbicacionesComponent } from './components/add-ubicaciones/add-ubicaciones.component';
import { RemoveProveedoresComponent } from './components/remove-proveedores/remove-proveedores.component';
import { RemoveUbicacionesComponent } from './components/remove-ubicaciones/remove-ubicaciones.component';


@NgModule({
  declarations: [
    HomeProductosComponent,
    UbicacionesComponent,
    CrearUbicacionComponent,
    AdmProductosComponent,
    CrearProductoComponent,
    AddProveedroComponent,
    AddUbicacionesComponent,
    RemoveProveedoresComponent,
    RemoveUbicacionesComponent
  ],
  imports: [
    CommonModule,
    ProductosRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class ProductosModule { }
