import { Component, OnInit } from '@angular/core';
import { VentasService } from '../../ventas/services/ventas.service';
import { UsuariosService } from '../../usuarios/services/usuarios.service';
import { DatePipe } from '@angular/common';
import { DetalleProducto } from '../../productos/interfaces/detalleProducto.interface';
import { DetallesService } from '../../productos/services/detalles.service';

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
    private detalleService: DetallesService
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

      }
    })

    this.detalleService.getPerecederos().subscribe({
      next: detalles => {
        this.numPerecederos = detalles.length;
        console.log(detalles);
      }
    })
  }

  logout() {
    
  }

}
