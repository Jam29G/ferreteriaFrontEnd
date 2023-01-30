import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Venta } from '../../interfaces/Venta.interface';
import { VentasService } from '../../services/ventas.service';
import { ShowVentaDetallesComponent } from '../../components/show-venta-detalles/show-venta-detalles.component';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-show-ventas',
  templateUrl: './show-ventas.component.html',
  styleUrls: ['./show-ventas.component.css']
})
export class ShowVentasComponent implements OnInit {

  ventas: Venta[] = [];

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
    
  });

  get ganancias(): number {
    return this._ganancias;
  }

  private _ganancias: number = 0;

  displayedColumns: string[] = ['id', 'numFactura', 'cliente', 'fecha', 'usuario', 'monto', 'options'];
  dataSource!: MatTableDataSource<Venta>;
  @ViewChild("showPag") paginator!: MatPaginator;
  @ViewChild("showSort") sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    private ventasService: VentasService,
    private datePipe: DatePipe,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    let fechaHoy = new Date();

    let startStr = this.datePipe.transform(fechaHoy, 'yyyy-MM-dd');

    this.ventasService.getTodayVentas(startStr!).subscribe({
      next: ventas => {
        
        this.ventas = ventas;

        this.dataSource = new MatTableDataSource(this.ventas);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.calculateGanancias();

      },
      error: err => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al obtener las ventas: ' + + err.error.message,
          showConfirmButton: false,
          timer: 2800
        })
      }
    })
  }

  showDetalles(id: number) {
    let venta = this.ventas.find(el => el.id! == id);

    this.dialog.open(ShowVentaDetallesComponent, {
      panelClass: 'dialog-responsive-xl',
      data: venta
    })

  }
  
  filterByDate() {
    let start = this.range.get('start')?.value;
    let end = this.range.get('end')?.value;

    if(start == null || end == null) {
      return
    }

    let startStr = this.datePipe.transform(start, 'yyyy-MM-dd hh:mm');
    let endStr = this.datePipe.transform(end, 'yyyy-MM-dd hh:mm');

    this.ventasService.getVentasByRangeDate(startStr!, endStr!).subscribe({
      next: ventas => {
        this.ventas = ventas;
        this.dataSource.data = this.ventas;
      },
      error: err => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al obtener las ventas: ' + + err.error.message,
          showConfirmButton: false,
          timer: 1500
        })
      }
    }) 

  } 

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      
    }
  }

  calculateGanancias() {
    this._ganancias = 0;
    this.ventas.forEach(el => {
      let totalCompra: number = 0;

      el.detalleVentas.forEach(detalle => {
        totalCompra = detalle.precioCompra * detalle.cantidad;
      })
      this._ganancias += el.montoFinal - totalCompra;

    })
  }

}
