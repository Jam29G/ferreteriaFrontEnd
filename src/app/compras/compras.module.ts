import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComprasRoutingModule } from './compras-routing.module';
import { HomeComprasComponent } from './pages/home-compras/home-compras.component';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CrearCompraComponent } from './pages/crear-compra/crear-compra.component';
import { AddItemComponent } from './components/add-item/add-item.component';


@NgModule({
  declarations: [
    HomeComprasComponent,
    CrearCompraComponent,
    AddItemComponent
  ],
  imports: [
    CommonModule,
    ComprasRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class ComprasModule { }
