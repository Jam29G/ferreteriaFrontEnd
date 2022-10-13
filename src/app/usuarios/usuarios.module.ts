import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { HomeUsuariosComponent } from './pages/home-usuarios/home-usuarios.component';
import { AdmUsuariosComponent } from './pages/adm-usuarios/adm-usuarios.component';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    HomeUsuariosComponent,
    AdmUsuariosComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    MaterialModule,
    RouterModule,
    SharedModule
  ]
})
export class UsuariosModule { }
