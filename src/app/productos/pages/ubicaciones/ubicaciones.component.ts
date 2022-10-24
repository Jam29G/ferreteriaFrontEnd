import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Ubicacion } from '../../interfaces/ubicacion.interface';
import { UbicacionService } from '../../services/ubicacion.service';
import { CrearUbicacionComponent } from '../../components/crear-ubicacion/crear-ubicacion.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ubicaciones',
  templateUrl: './ubicaciones.component.html',
  styleUrls: ['./ubicaciones.component.css']
})
export class UbicacionesComponent implements OnInit {

  //Datatable
  displayedColumns: string[] = ['zona', 'lugar', 'numero', 'options'];
  dataSource!: MatTableDataSource<Ubicacion>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ubicaciones: Ubicacion[] = [];

  constructor(
    public dialog: MatDialog,
    private ubicacionService: UbicacionService
  ) { }

  ngOnInit(): void {

    this.ubicacionService.getAll().subscribe({
      next: ubicaciones => {
        this.ubicaciones = ubicaciones;
        this.dataSource = new MatTableDataSource(this.ubicaciones);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })

  }

  create() {
    const dialogRef = this.dialog.open(CrearUbicacionComponent, {
      panelClass: 'dialog-responsive'
    });
    dialogRef.afterClosed().subscribe({
      next: response => {
        if(response !== undefined) {
          let newUbicacion: Ubicacion = response;
          this.ubicaciones.push(newUbicacion);
          this.dataSource.data = this.ubicaciones;

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Empresa registrada correctamente',
            showConfirmButton: false,
            timer: 1500
          })
        }
        
      }
    })
  }

  delete(id: number) {

    let title: string = "eliminar";

    Swal.fire({
      title: `¿Seguro que quieres ${title} la empresa?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `${title}`,
      denyButtonText: `Cancelar`,
    }).then((result) => {

      if (result.isConfirmed) {

        this.ubicacionService.delete(id).subscribe({
          next: (response) => {
            let index: number = this.ubicaciones.findIndex( element => element.id == id );
            this.ubicaciones.splice(index, 1);

            this.dataSource.data = this.ubicaciones;

            Swal.fire({
              position: 'center',
              icon: 'success',
              title: `Eliminado correctamente`,
              showConfirmButton: false,
              timer: 1500
            })
          },
          error: (err) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: `Error al eliminar la ubicación: ${err.error.message}` ,
              showConfirmButton: false,
              timer: 2800
            })
          }
        })
 
      } else if (result.isDenied) {
        Swal.fire('Accion cancelada')
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

}
