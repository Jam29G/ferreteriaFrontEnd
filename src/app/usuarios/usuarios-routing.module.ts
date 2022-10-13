import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmUsuariosComponent } from './pages/adm-usuarios/adm-usuarios.component';
import { HomeUsuariosComponent } from './pages/home-usuarios/home-usuarios.component';

const routes: Routes = [
  {
    path: '',
    component: HomeUsuariosComponent,
    children: [
      {
        path: 'adm',
        component: AdmUsuariosComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
