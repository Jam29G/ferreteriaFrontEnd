import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Proveedor, Producto } from '../../interfaces/producto.interface';
import { EmpresaService } from '../../../empresas/services/empresa.service';
import { Empresa } from '../../../empresas/interfaces/empresa.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProductoService } from '../../services/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-proveedro',
  templateUrl: './add-proveedro.component.html',
  styleUrls: ['./add-proveedro.component.css']
})
export class AddProveedroComponent implements OnInit {

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
    this.empresaService.getAll(true).subscribe({
      next: empresas => {

        this.data.proveedores!.forEach( prov => {
          let index = empresas.findIndex(el => el.id! == prov.id!);

          empresas.splice(index, 1);
        })

        this.empresas = empresas;

        this.dataSource = new MatTableDataSource(this.empresas);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: err => {

      }
    })
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

  addProveedores() {

    this.productoService.addEmpresas(this.data.id!, this.empresasAdd).subscribe({
      next: producto => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Proveedores añadidos correctamente',
          showConfirmButton: false,
          timer: 1500
        })
        this.dialogRef.close();
      },
      error: err => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error al añadir los proveedores',
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
