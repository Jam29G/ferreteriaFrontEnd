import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventarioRoutingModule } from './inventario-routing.module';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeInventarioComponent } from './pages/home-inventario/home-inventario.component';
import { AddInventarioComponent } from './pages/add-inventario/add-inventario.component';
import { UpdateCantidadComponent } from './components/update-cantidad/update-cantidad.component';
import { InventarioComponent } from './pages/inventario/inventario.component';


@NgModule({
  declarations: [
    HomeInventarioComponent,
    AddInventarioComponent,
    UpdateCantidadComponent,
    InventarioComponent
  ],
  imports: [
    CommonModule,
    InventarioRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class InventarioModule { }
