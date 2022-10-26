import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Empresa } from 'src/app/empresas/interfaces/empresa.interface';
import { EmpresaService } from 'src/app/empresas/services/empresa.service';
import Swal from 'sweetalert2';
import { Producto } from '../../interfaces/producto.interface';
import { ProductoService } from '../../services/producto.service';
import { AddProveedroComponent } from '../add-proveedro/add-proveedro.component';

@Component({
  selector: 'app-remove-proveedores',
  templateUrl: './remove-proveedores.component.html',
  styleUrls: ['./remove-proveedores.component.css']
})
export class RemoveProveedoresComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'direccion', 'telefono', 'correo', 'options'];
  dataSource!: MatTableDataSource<Empresa>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialogRef: MatDialogRef<AddProveedroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Producto,
    private empresaService: EmpresaService,
    private productoService: ProductoService
  ) { }

  empresas: Empresa[] = [];

  empresasAdd: Empresa[] = [];

  ngOnInit(): void {

    this.empresas = this.data.proveedores!;

    this.dataSource = new MatTableDataSource(this.empresas);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  edit(id: number, event:any) {

    if(event.checked) {
      let empresa: Empresa = this.empresas.find(el => el.id == id)!;
      this.empresasAdd.push(empresa);
    } else {
      let index: number = this.empresasAdd.findIndex(el => el.id == id)!;
      this.empresasAdd.splice(index, 1);
    }

  }

  verifyChecked(id: number): boolean {
    let index: number = this.empresasAdd.findIndex(el => el.id == id)!;
    if(index != -1) return true;
    return false;
  }

  removeProveedores() {

    this.productoService.removeEmpresas(this.data.id!, this.empresasAdd).subscribe({
      next: producto => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Proveedores eliminados correctamente',
          showConfirmButton: false,
          timer: 1500
        })
        this.dialogRef.close();
      },
      error: err => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error al eliminar los proveedores',
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
