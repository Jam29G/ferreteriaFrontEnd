import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductosRoutingModule } from './productos-routing.module';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeProductosComponent } from './pages/home-productos/home-productos.component';
import { UbicacionesComponent } from './pages/ubicaciones/ubicaciones.component';
import { CrearUbicacionComponent } from './components/crear-ubicacion/crear-ubicacion.component';


@NgModule({
  declarations: [
    HomeProductosComponent,
    UbicacionesComponent,
    CrearUbicacionComponent
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
