import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Producto } from '../../interfaces/producto.interface';
import { Ubicacion } from '../../interfaces/ubicacion.interface';
import { ProductoService } from '../../services/producto.service';
import { UbicacionService } from '../../services/ubicacion.service';

@Component({
  selector: 'app-remove-ubicaciones',
  templateUrl: './remove-ubicaciones.component.html',
  styleUrls: ['./remove-ubicaciones.component.css']
})
export class RemoveUbicacionesComponent implements OnInit {

  //Datatable
  displayedColumns: string[] = ['zona', 'lugar', 'numero', 'options'];
  dataSource!: MatTableDataSource<Ubicacion>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ubicaciones: Ubicacion[] = [];
  addUbicaciones: Ubicacion[] = [];

  constructor(
    private dialogRef: MatDialogRef<RemoveUbicacionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Producto,
    private ubicacionService: UbicacionService,
    private productoService: ProductoService
  ) { }

  ngOnInit(): void {

    this.ubicaciones = this.data.ubicaciones!;

    this.dataSource = new MatTableDataSource(this.ubicaciones);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  edit(id: number, event:any) {

    if(event.checked) {
      let ubicacion: Ubicacion = this.ubicaciones.find(el => el.id == id)!;
      this.addUbicaciones.push(ubicacion);
    } else {
      let index: number = this.addUbicaciones.findIndex(el => el.id == id)!;
      this.addUbicaciones.splice(index, 1);
    }

    console.log(this.addUbicaciones);


  }

  verifyChecked(id: number): boolean {
    let index: number = this.addUbicaciones.findIndex(el => el.id == id)!;
    if(index != -1) return true;
    return false;
  }

  sendUbicaciones() {
    
    this.productoService.removeUbicaciones(this.data.id!, this.addUbicaciones).subscribe({
      next: producto => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'ubicaciones añadidas correctamente',
          showConfirmButton: false,
          timer: 1500
        })
        this.dialogRef.close();
      },
      error: err => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error al añadir las ubicaciones',
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

}
