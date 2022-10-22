import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { CajasRoutingModule } from './cajas-routing.module';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { HomeCajasComponent } from './pages/home-cajas/home-cajas.component';
import { GestionCajaComponent } from './pages/gestion-caja/gestion-caja.component';
import { AbrirCajaComponent } from './components/abrir-caja/abrir-caja.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MovimientoCajaComponent } from './components/movimiento-caja/movimiento-caja.component';
import { AprobCajasComponent } from './pages/aprob-cajas/aprob-cajas.component';
import { ShowDetailsComponent } from './components/show-details/show-details.component';
import { RegistroCajasComponent } from './pages/registro-cajas/registro-cajas.component';


@NgModule({
  declarations: [
    HomeCajasComponent,
    GestionCajaComponent,
    AbrirCajaComponent,
    MovimientoCajaComponent,
    AprobCajasComponent,
    ShowDetailsComponent,
    RegistroCajasComponent
  ],
  imports: [
    CommonModule,
    CajasRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [
    DatePipe
  ]
})
export class CajasModule { }
