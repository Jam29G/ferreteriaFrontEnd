import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Empresa } from 'src/app/empresas/interfaces/empresa.interface';
import { EmpresaService } from 'src/app/empresas/services/empresa.service';
import { DetalleProducto } from 'src/app/productos/interfaces/detalleProducto.interface';
import { DetallesService } from 'src/app/productos/services/detalles.service';

interface dataDialog {
  empresa: Empresa;
  detallesProd: DetalleProducto[];
}

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {

  //Datatable
  detallesProd: DetalleProducto[] = [];
  detallesAdd: DetalleProducto[] = [];

  displayedColumns: string[] = ['codigo', 'nombre' , 'precioCompra', 'cantidad', 'perecedero','fechaVenc' , 'options'];
  dataSource!: MatTableDataSource<DetalleProducto>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private empresaService: EmpresaService,
    private detalleService: DetallesService,
    @Inject(MAT_DIALOG_DATA) public data: dataDialog,
    private dialogRef: MatDialogRef<AddItemComponent>,

  ) { }

  ngOnInit(): void {

    this.detalleService.getByEmpresa(this.data.empresa.id!, true).subscribe({

      next: detalles => {
  
        this.data.detallesProd.forEach(el => {
          let index = detalles.findIndex(el2 => el2.id! == el.id!);

          detalles.splice(index, 1);          

        })

        this.detallesProd = detalles;
        this.dataSource = new MatTableDataSource(this.detallesProd);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.dataSource.filterPredicate = (data: DetalleProducto, filter: string) => {

          if(data.producto.codigo.toLocaleLowerCase().includes(filter) || data.producto.nombre.toLocaleLowerCase().includes(filter) ) {
            return true;
          }

          return false;
        };

      },
      error: err => {

      }


    })
  }

  edit(id: number, event:any) {

    if(event.checked) {
      let detalle: DetalleProducto = this.detallesProd.find(el => el.id == id)!;
      this.detallesAdd.push(detalle);

    } else {
      let index: number = this.detallesAdd.findIndex(el => el.id == id)!;
      this.detallesAdd.splice(index, 1);
    }


  }

  close() {
    this.dialogRef.close();
  }

  AddCompra() {

    this.dialogRef.close(this.detallesAdd);

  }

  verifyChecked(id: number): boolean {
    let index: number = this.detallesAdd.findIndex(el => el.id == id)!;
    if(index != -1) return true;
    return false;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      
    }
  }

}
