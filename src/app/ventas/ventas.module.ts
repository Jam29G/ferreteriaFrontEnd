import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { VentasRoutingModule } from './ventas-routing.module';
import { HomeVentasComponent } from './pages/home-ventas/home-ventas.component';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CrearVentaComponent } from './pages/crear-venta/crear-venta.component';
import { AddToVentaComponent } from './components/add-to-venta/add-to-venta.component';
import { ShowVentasComponent } from './pages/show-ventas/show-ventas.component';
import { ShowVentaDetallesComponent } from './components/show-venta-detalles/show-venta-detalles.component';



@NgModule({
  declarations: [
    HomeVentasComponent,
    CrearVentaComponent,
    AddToVentaComponent,
    ShowVentasComponent,
    ShowVentaDetallesComponent,
  ],
  imports: [
    CommonModule,
    VentasRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [
    DatePipe
  ]
})
export class VentasModule { }
