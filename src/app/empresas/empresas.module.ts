import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpresasRoutingModule } from './empresas-routing.module';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeEmpresasComponent } from './pages/home-empresas/home-empresas.component';
import { AdmEmpresasComponent } from './pages/adm-empresas/adm-empresas.component';
import { CrearEmpresaComponent } from './components/crear-empresa/crear-empresa.component';
import { UpdateEmpresaComponent } from './components/update-empresa/update-empresa.component';


@NgModule({
  declarations: [
    HomeEmpresasComponent,
    AdmEmpresasComponent,
    CrearEmpresaComponent,
    UpdateEmpresaComponent
  ],
  imports: [
    CommonModule,
    EmpresasRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class EmpresasModule { }
