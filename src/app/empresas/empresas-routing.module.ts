import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeEmpresasComponent } from './pages/home-empresas/home-empresas.component';
import { AdmEmpresasComponent } from './pages/adm-empresas/adm-empresas.component';

const routes: Routes = [
  {
    path: "",
    component: HomeEmpresasComponent,
    children: [
      {
        path: "adm",
        component: AdmEmpresasComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresasRoutingModule { }
