import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CajasRoutingModule } from './cajas-routing.module';
import { AdmCajasComponent } from './pages/adm-cajas/adm-cajas.component';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { HomeCajasComponent } from './pages/home-cajas/home-cajas.component';
import { GestionCajaComponent } from './pages/gestion-caja/gestion-caja.component';


@NgModule({
  declarations: [
    AdmCajasComponent,
    HomeCajasComponent,
    GestionCajaComponent
  ],
  imports: [
    CommonModule,
    CajasRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class CajasModule { }
