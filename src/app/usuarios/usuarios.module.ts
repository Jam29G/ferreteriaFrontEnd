import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { HomeUsuariosComponent } from './pages/home-usuarios/home-usuarios.component';
import { AdmUsuariosComponent } from './pages/adm-usuarios/adm-usuarios.component';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AddUsuarioComponent } from './components/add-usuario/add-usuario.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HomeUsuariosComponent,
    AdmUsuariosComponent,
    AddUsuarioComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    MaterialModule,
    RouterModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class UsuariosModule { }
