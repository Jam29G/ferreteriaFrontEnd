import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CajasService } from '../../services/cajas.service';
import { Caja } from '../../interfaces/caja.interface';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { ShowDetailsComponent } from '../../components/show-details/show-details.component';
import { switchMap } from 'rxjs';
import { MovimCaja } from '../../interfaces/movimCaja.interface';

interface Details {
  caja: Caja | undefined;
  ingrRegistros: MovimCaja[] | undefined;
  egresosRegistros: MovimCaja[] | undefined;
}

@Component({
  selector: 'app-aprob-cajas',
  templateUrl: './aprob-cajas.component.html',
  styleUrls: ['./aprob-cajas.component.css']
})
export class AprobCajasComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'saldoInic', 'saldoFinal', 'saldoIngr', 'fechaApertura', 'fechaCierre', 'encargado', 'usuario', 'acciones'];
  dataSource!: MatTableDataSource<Caja>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  _cajas: Caja[] = [];

  constructor(
    private cajaService: CajasService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.cajaService.getPendientesAprob().subscribe({
      next: cajas => {
        this._cajas = cajas;
        this.dataSource = new MatTableDataSource(this._cajas);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: err => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al obtener los registros: ' + + err.error.message,
          showConfirmButton: false,
          timer: 2800
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

  changeState(id: number, aprob: string, title: string) {
    Swal.fire({
      title: `¿Seguro que desea ${title.toLocaleLowerCase()} este registro?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `${title}`,
      denyButtonText: `Cancelar`,
    }).then((result) => {

      if (result.isConfirmed) {

        this.cajaService.changeAprob(id, aprob).subscribe({
          next: (response) => {
            let index: number = this._cajas.findIndex( element => element.id == id );
            this._cajas.splice(index, 1);

            this.dataSource.data = this._cajas;

            Swal.fire({
              position: 'center',
              icon: 'success',
              title: `Cambio registrado con exito`,
              showConfirmButton: false,
              timer: 1500
            })
          },
          error: (err) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: `Ha ocurrido un error: ${err.error.message}` ,
              showConfirmButton: false,
              timer: 2600
            })
          }
        })
 
      } else if (result.isDenied) {
        Swal.fire('Accion cancelada')
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

}
