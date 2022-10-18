import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AbrirCajaComponent } from '../../components/abrir-caja/abrir-caja.component';
import { Caja, Usuario } from '../../interfaces/caja.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { CajasService } from '../../services/cajas.service';
import { UsuariosService } from 'src/app/usuarios/services/usuarios.service';
import Swal from 'sweetalert2';
import { MovimientoCajaComponent } from '../../components/movimiento-caja/movimiento-caja.component';


@Component({
  selector: 'app-gestion-caja',
  templateUrl: './gestion-caja.component.html',
  styleUrls: ['./gestion-caja.component.css']
})
export class GestionCajaComponent implements OnInit {

  _caja: Caja | undefined;

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
      next: caja => {
        if(caja == undefined) return;
        this._caja = caja;
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
      next: caja => {
        if(caja == undefined) return;

        this._caja = caja;
      }
    })
  }

}
