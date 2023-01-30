import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DetallesService } from 'src/app/productos/services/detalles.service';
import { DetalleProducto } from '../../../productos/interfaces/detalleProducto.interface';

@Component({
  selector: 'app-add-to-venta',
  templateUrl: './add-to-venta.component.html',
  styleUrls: ['./add-to-venta.component.css']
})
export class AddToVentaComponent implements OnInit {

  detallesProd: DetalleProducto[] = [];
  detallesAdd: DetalleProducto[] = [];

  displayedColumns: string[] = ['codigo', 'nombre' , 'precioVenta', 'cantidad', 'descuento' ,'perecedero', 'fechaVenc' , 'options'];
  dataSource!: MatTableDataSource<DetalleProducto>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private detalleService: DetallesService,
    @Inject(MAT_DIALOG_DATA) public data: DetalleProducto[],
    private dialogRef: MatDialogRef<AddToVentaComponent>,
  ) { }

  ngOnInit(): void {

    this.detalleService.getAll().subscribe({
      next: detallesF => {

        let detalles: DetalleProducto[] = [];

        detallesF.forEach((el, index) => {
          
          if(!el.isVencido && el.cantidad != null) {
            detalles.push(detallesF[index]);

          }

        })

        this.data.forEach(el => {
          let index = detalles.findIndex(el2 => el2.id! == el.id!);

          detalles.splice(index, 1);          

        })

        this.detallesProd = detalles;
        this.dataSource = new MatTableDataSource(this.detallesProd);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      },
      error: err => {

      }
    })


  }

  AddVenta() {
    this.dialogRef.close(this.detallesAdd);
  }

  edit(id: number, event:any) {

    if(event.checked) {
      let detalle: DetalleProducto = this.detallesProd.find(el => el.id == id)!;
      this.detallesAdd.push(detalle);

    } else {
      let index: number = this.detallesAdd.findIndex(el => el.id == id)!;
      this.detallesAdd.splice(index, 1);
    }

    console.log(this.detallesAdd);

  }

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;

    if(filterValue.length == 0) {
      this.detalleService.getAll().subscribe({
        next: detalles => {
  
          this.data.forEach(el => {
            let index = detalles.findIndex(el2 => el2.id! == el.id!);
  
            detalles.splice(index, 1);          
  
          })
  
          this.detallesProd = detalles;
          this.dataSource.data = this.detallesProd;

          if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
            
          }
  
        },
        error: err => {
  
        }
      })

      return
    } 

    this.detalleService.getByFilter(filterValue).subscribe({
      next: detalles => {

        this.data.forEach(el => {
          let index = detalles.findIndex(el2 => el2.id! == el.id!);

          detalles.splice(index, 1);  

        })

        this.detallesProd = detalles;
        this.dataSource.data = this.detallesProd;

        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
          
        } 

      },
      error: err => {

      }
    })


  }

  close() {
    this.dialogRef.close();
  }

  verifyChecked(id: number): boolean {
    let index: number = this.detallesAdd.findIndex(el => el.id == id)!;
    if(index != -1) return true;
    return false;
  }

}
