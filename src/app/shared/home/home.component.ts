import { Component, OnInit } from '@angular/core';
import { VentasService } from '../../ventas/services/ventas.service';
import { UsuariosService } from '../../usuarios/services/usuarios.service';
import { DatePipe } from '@angular/common';
import { DetalleProducto } from '../../productos/interfaces/detalleProducto.interface';
import { DetallesService } from '../../productos/services/detalles.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  numVentas: number = 0;
  numUsuarios: number = 0;
  numPerecederos: number = 0;

  constructor(
    private ventaService: VentasService,
    private usuariosService: UsuariosService,
    private datePipe: DatePipe,
    private detalleService: DetallesService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    let fechaHoy = new Date();

    let startStr = this.datePipe.transform(fechaHoy, 'yyyy-MM-dd');
    this.ventaService.getTodayVentas(startStr!).subscribe({
      next: ventas => {
        this.numVentas = ventas.length;
      },
      error: err => {

      }
    })

    this.usuariosService.getAll(true).subscribe({
      next: usuarios => {
        this.numUsuarios = usuarios.length;
      },
      error: err => {
        if(err.error.status == 401 || err.error.status == undefined) {
          
         
        }
      }
    })

    this.detalleService.getPerecederos().subscribe({
      next: detalles => {
        this.numPerecederos = detalles.length;
        console.log(detalles);
      }
    })

    this.detalleService.checkPerecederos().subscribe({
      next: cambios => {
        console.log(cambios)
        if(cambios) {
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Se han removido productos vencidos del inventario',
            showCloseButton: true,
          })
        }
      },
      error: err => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Ocurrio un error al actualizar la lista de productos perecederos',
          showConfirmButton: false,
          timer: 2800
        })
      }
    })

  }

  logout() {
    
  }

}
