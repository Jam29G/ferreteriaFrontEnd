import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentasRoutingModule } from './ventas-routing.module';
import { HomeVentasComponent } from './pages/home-ventas/home-ventas.component';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CrearVentaComponent } from './pages/crear-venta/crear-venta.component';
import { AddToVentaComponent } from './components/add-to-venta/add-to-venta.component';



@NgModule({
  declarations: [
    HomeVentasComponent,
    CrearVentaComponent,
    AddToVentaComponent,
  ],
  imports: [
    CommonModule,
    VentasRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class VentasModule { }
