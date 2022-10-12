import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { HomeSharedComponent } from './home-shared/home-shared.component';



@NgModule({
  declarations: [
    SidenavComponent,
    HomeComponent,
    ToolbarComponent,
    HomeSharedComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [
    SidenavComponent,
    ToolbarComponent,
    HomeComponent,
    HomeSharedComponent
  ]
})
export class SharedModule { }
