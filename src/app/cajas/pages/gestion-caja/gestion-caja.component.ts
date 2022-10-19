import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AbrirCajaComponent } from '../../components/abrir-caja/abrir-caja.component';
import { Caja, Usuario } from '../../interfaces/caja.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { CajasService } from '../../services/cajas.service';
import { UsuariosService } from 'src/app/usuarios/services/usuarios.service';
import Swal from 'sweetalert2';
import { MovimientoCajaComponent } from '../../components/movimiento-caja/movimiento-caja.component';
import { MatTableDataSource } from '@angular/material/table';
import { MovimCaja } from '../../interfaces/movimCaja.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-gestion-caja',
  templateUrl: './gestion-caja.component.html',
  styleUrls: ['./gestion-caja.component.css']
})
export class GestionCajaComponent implements OnInit {

  //Datatable
  //Datatable
  ingresosDisplayedColumns: string[] = ['motivo', 'monto', 'fecha', 'caja', 'usuario', 'venta'];
  ingresosCajaDataSource!: MatTableDataSource<MovimCaja>;

  egresosDisplayedColumns: string[] = ['motivo', 'monto', 'fecha', 'caja', 'usuario', 'venta'];
  egresosCajaDataSource!: MatTableDataSource<MovimCaja>;

  @ViewChild('ingrPag') ingresoPaginator!: MatPaginator;
  @ViewChild('ingrSort') ingresoSort!: MatSort;

  @ViewChild('egrPag') egresoPaginator!: MatPaginator;
  @ViewChild('egrSort') egresoSort!: MatSort;

  _caja: Caja | undefined;

  ingresoRegistros: MovimCaja[] = [];
  egresoRegistros: MovimCaja[] = [];

  get caja(): Caja | undefined {
    return this._caja
  }

  usuario!: Usuario;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private cajaService: CajasService,
    private usuarioService: UsuariosService,
  ) { }

  ngOnInit(): void {
    this.cajaService.getCajaUsuario(this.authService.auth?.id!).subscribe({
      next: caja => {
        this._caja = caja;

        //obteniendo registros de caja
        this.cajaService.getMovimCaja(this._caja?.id!, true).subscribe({
          next: registros => {
            this.ingresoRegistros = registros;
            this.ingresosCajaDataSource = new MatTableDataSource(this.ingresoRegistros);
            this.ingresosCajaDataSource.paginator = this.ingresoPaginator;
            this.ingresosCajaDataSource.sort = this.ingresoSort;
          },

          error: err => {

            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Error al obtener los movimientos de la caja: ' + + err.error.message,
              showConfirmButton: false,
              timer: 1500
            })

          }
        })

        //obteniendo registros de caja
        this.cajaService.getMovimCaja(this._caja?.id!, false).subscribe({
          next: registros => {
            this.egresoRegistros = registros;
            this.egresosCajaDataSource = new MatTableDataSource(this.egresoRegistros);
            this.egresosCajaDataSource.paginator = this.egresoPaginator;
            this.egresosCajaDataSource.sort = this.egresoSort;
          },
          error: err => {
            
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Error al obtener los movimientos de la caja: ' + + err.error.message,
              showConfirmButton: false,
              timer: 1500
            })

          }
        })


      },

      error: err => {

      }

    })

    this.usuarioService.getById(this.authService.auth?.id!).subscribe({
      next: usuario => {
        this.usuario = {
          id: usuario.id!,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          username: usuario.username
        }
      }
    })

    
  }

  abrirCaja() {
    const dialog = this.dialog.open(AbrirCajaComponent, {
      data: this.usuario,
      panelClass: 'dialog-responsive'
    });

    dialog.afterClosed().subscribe({
      next: data => {
        
        if(data === undefined) return;

        this._caja = data;

        //obteniendo registros de caja
        this.cajaService.getMovimCaja(this._caja?.id!, true).subscribe({
          next: registros => {
            this.ingresoRegistros = registros;
            this.ingresosCajaDataSource = new MatTableDataSource(this.ingresoRegistros);
            this.ingresosCajaDataSource.paginator = this.ingresoPaginator;
            this.ingresosCajaDataSource.sort = this.ingresoSort;
          },

          error: err => {

            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Error al obtener los movimientos de la caja: ' + + err.error.message,
              showConfirmButton: false,
              timer: 1500
            })

          }
        })

        //obteniendo registros de caja
        this.cajaService.getMovimCaja(this._caja?.id!, false).subscribe({
          next: registros => {
            this.egresoRegistros = registros;
            this.egresosCajaDataSource = new MatTableDataSource(this.egresoRegistros);
            this.egresosCajaDataSource.paginator = this.egresoPaginator;
            this.egresosCajaDataSource.sort = this.egresoSort;
          },
          error: err => {
            
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Error al obtener los movimientos de la caja: ' + + err.error.message,
              showConfirmButton: false,
              timer: 1500
            })

          }
        })

      }
    })


  }

  cerrarCaja() {
    Swal.fire({
      title: `¿Seguro que desea cerrar la caja?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Si`,
      denyButtonText: `Cancelar`,
    }).then((result) => {

      if (result.isConfirmed) {

        this.cajaService.cerrarCaja(this._caja!).subscribe({
          next: (response) => {

            Swal.fire({
              position: 'center',
              icon: 'success',
              title: `Caja cerrada correctamente`,
              showConfirmButton: false,
              timer: 1500
            })

            this._caja = undefined;

          },
          error: (err) => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: `Error al cerrar la caja` ,
              showConfirmButton: false,
              timer: 1500
            })
          }
        })
 
      } else if (result.isDenied) {
        Swal.fire('Accion cancelada')
      }
    })
  }

  ingresarCaja() {
    let caja: Caja = {...this._caja!};
    caja.isIngreso = true;
    const dialog = this.dialog.open(MovimientoCajaComponent, {
      data: caja,
      panelClass: 'dialog-responsive'
    });

    dialog.afterClosed().subscribe({
      next: res => {
        if(res == undefined) return;
        this._caja = res.caja;
        this.ingresoRegistros.push(res.movimCaja);
        this.ingresosCajaDataSource.data = this.ingresoRegistros;
      }
    })
  }

  retiroCaja() {
    let caja: Caja = {...this._caja!};
    caja.isIngreso = false;
    const dialog = this.dialog.open(MovimientoCajaComponent, {
      data: caja,
      panelClass: 'dialog-responsive'
    });

    dialog.afterClosed().subscribe({
      next: res => {
        if(res == undefined) return;

        this._caja = res.caja;
        this.egresoRegistros.push(res.movimCaja);
        this.egresosCajaDataSource.data = this.egresoRegistros;
      }
    })
  }

}
