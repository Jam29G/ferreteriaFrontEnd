import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Caja } from '../../interfaces/caja.interface';
import { CajasService } from '../../services/cajas.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { switchMap } from 'rxjs';
import { MovimCaja } from '../../interfaces/movimCaja.interface';
import { ShowDetailsComponent } from '../../components/show-details/show-details.component';


interface Details {
  caja: Caja | undefined;
  ingrRegistros: MovimCaja[] | undefined;
  egresosRegistros: MovimCaja[] | undefined;
}

@Component({
  selector: 'app-registro-cajas',
  templateUrl: './registro-cajas.component.html',
  styleUrls: ['./registro-cajas.component.css']
})
export class RegistroCajasComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'saldoInic', 'saldoFinal', 'saldoIngr', 'fechaApertura', 'fechaCierre', 'encargado', 'usuario', 'acciones'];
  dataSource!: MatTableDataSource<Caja>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  _cajas: Caja[] = [];

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  filterOption: string = "abierta";

  constructor(
    private cajaService: CajasService,
    public dialog: MatDialog,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.cajaService.getAllCajas(true).subscribe({
      next: cajas => {
        this._cajas = cajas
        this.dataSource = new MatTableDataSource(this._cajas);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: err => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al obtener los registros de caja: ' + + err.error.message,
          showConfirmButton: false,
          timer: 2800
        })
      }
    })
  }

  getAllActivo() {
    this.cajaService.getAllCajas(true).subscribe({
      next: cajas => {
        this._cajas = cajas;
        this.dataSource.data = this._cajas;
      },
      error: err => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al obtener los registros de caja: ' + + err.error.message,
          showConfirmButton: false,
          timer: 2800
        })
      }
    })
  }


  showDetails(id: number) {
    let details: Details = {
      caja: undefined,
      ingrRegistros: undefined,
      egresosRegistros: undefined
    }

    this.cajaService.getCajaById(id)
    .pipe(
      switchMap( caja => {
        details.caja = caja
        return this.cajaService.getMovimCaja(details.caja.id!, true);
      } ),
      switchMap(ingresos => {
        details.ingrRegistros = ingresos
        return this.cajaService.getMovimCaja(details.caja!.id!, false);
      })
    )
    .subscribe({
      next: egresos => {
        details.egresosRegistros = egresos;

        this.dialog.open(ShowDetailsComponent, {
          panelClass: 'dialog-responsive-xl',
          data: {...details}
        })
        
      },
      error: err => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: `Error al consultar los detalles: ${err.error.message}` ,
          showConfirmButton: false,
          timer: 2600
        })
      }
    })
 
  }

  changeFilter(event: any) {
    this.range.reset();
    this.filterOption = event.value;

    switch(this.filterOption) {
      case "abierta": 
        this.getAllActivo();
      break;
      case "cerrada":

        this.cajaService.getCajasToday(false, "").subscribe({
          next: cajas => {
            this._cajas = cajas;
            this.dataSource.data = this._cajas;
          },
          error: err => {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Error al obtener los registros de caja: ' + + err.error.message,
              showConfirmButton: false,
              timer: 2800
            })
          }
        })

      break;
      case "anulada": 
        this.cajaService.getCajasToday(false, "X").subscribe({
          next: cajas => {
            this._cajas = cajas;
            this.dataSource.data = this._cajas;
          },
          error: err => {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Error al obtener los registros de caja: ' + + err.error.message,
              showConfirmButton: false,
              timer: 2800
            })
          }
        })
      break;
    }
  }

  filterByDate() {
    let start = this.range.get('start')?.value;
    let end = this.range.get('end')?.value;

    if(start == null || end == null) {
      return
    }

    let startStr = this.datePipe.transform(start, 'yyyy-MM-dd hh:mm');
    let endStr = this.datePipe.transform(end, 'yyyy-MM-dd hh:mm');

    switch(this.filterOption) {

      case "cerrada":

        this.cajaService.getCajasByDateRange(false, "", startStr!, endStr!).subscribe({
          next: cajas => {
            this._cajas = cajas;
            this.dataSource.data = this._cajas;
          },
          error: err => {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Error al obtener los registros de caja: ' + + err.error.message,
              showConfirmButton: false,
              timer: 2800
            })
          }
        })

      break;
      case "anulada": 
        this.cajaService.getCajasByDateRange(false, "X", startStr!, endStr!).subscribe({
          next: cajas => {
            this._cajas = cajas;
            this.dataSource.data = this._cajas;
          },
          error: err => {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Error al obtener los registros de caja: ' + + err.error.message,
              showConfirmButton: false,
              timer: 2800
            })
          }
        })
      break;

    }

  }

  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      
    }
  } 

}
