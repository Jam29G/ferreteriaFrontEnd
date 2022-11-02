import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ToolbarComponent } from './toolbar/toolbar.component';



@NgModule({
  declarations: [
    SidenavComponent,
    HomeComponent,
    ToolbarComponent,
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
  ],
  providers: [
    DatePipe
  ]
})
export class SharedModule { }
