import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ComprasRoutingModule } from './compras-routing.module';
import { HomeComprasComponent } from './pages/home-compras/home-compras.component';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CrearCompraComponent } from './pages/crear-compra/crear-compra.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { VerComprasComponent } from './pages/ver-compras/ver-compras.component';
import { ShowDetailsComponent } from './components/show-details/show-details.component';


@NgModule({
  declarations: [
    HomeComprasComponent,
    CrearCompraComponent,
    AddItemComponent,
    VerComprasComponent,
    ShowDetailsComponent
  ],
  imports: [
    CommonModule,
    ComprasRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [
    DatePipe
  ]
})
export class ComprasModule { }
