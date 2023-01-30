import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { DetallesService } from 'src/app/productos/services/detalles.service';
import { ProductoService } from 'src/app/productos/services/producto.service';
import { Producto } from '../../../productos/interfaces/producto.interface';
import { DetalleProducto } from 'src/app/productos/interfaces/detalleProducto.interface';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { UpdateCantidadComponent } from '../../components/update-cantidad/update-cantidad.component';

interface detailTable {
  id: number;
  codigo: string;
  nombre: string;
  precioCompra: number;
  precioVenta: number;
  cantidad?: number;
  fechaVenc?: Date;
  isVencido?: boolean;
}

interface dataDialog {
  detalle: DetalleProducto,
  type: string
}

@Component({
  selector: 'app-add-inventario',
  templateUrl: './add-inventario.component.html',
  styleUrls: ['./add-inventario.component.css']
})

export class AddInventarioComponent implements OnInit {

  //filtro
  myControl = new FormControl<string>('');
  productos: Producto[] = [];
  producto: Producto | undefined;
  detallesProducto: DetalleProducto[] = [];

  detailTable: detailTable[] = [];

  //Datatable
  displayedColumns: string[] = ['precioCompra', 'precioVenta', 'cantidad', 'fechaVenc', 'isVencido', 'options'];
  dataSource!: MatTableDataSource<detailTable>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productoService: ProductoService,
    private detallesService: DetallesService,
    public dialog: MatDialog
  ) { }


  ngOnInit(): void {
    this.productoService.getAll(true).subscribe({
      next: productos => {
        this.productos = productos;
        console.log(productos)
        
      },
      error: err => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al obtener las empresas: ' + err.error.message,
          showConfirmButton: false,
          timer: 1500
        })
      }
    })

    this.dataSource = new MatTableDataSource(this.detailTable);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  buscar() {
    this.productoService.findProductos(this.myControl.value?.trim().toLocaleLowerCase()!, true).subscribe({
      next: productos => {
        this.productos = productos;
      },
      error: err => {

      }
    })
  }

  displayFn(producto: Producto): string {
    return producto && producto.nombre && producto.codigo ? producto.codigo! + " - " + producto.nombre : '';
  }

  opcionSeleccionada(event: MatAutocompleteSelectedEvent) {
    const producto: Producto = event.option.value;

    this.productoService.getById(producto.id!).subscribe({
      next: producto => {
        this.producto = producto;
        
        this.detallesService.getByProductoId(this.producto.id!, true).subscribe({
          next: detallesF => {

            let detalles: DetalleProducto[] = [];

            detallesF.forEach((el, index) => {
          
              if(!el.isVencido && el.cantidad != null) {
                detalles.push(detallesF[index]);

              }

            })

            this.detallesProducto = detalles;
            
            let detailArr: detailTable[] = [];

            detalles.forEach(el => {

              let detail: detailTable = {
                id: el.id!,
                codigo: el.producto.codigo,
                nombre: el.producto.nombre,
                precioCompra: el.precioCompra,
                precioVenta: el.precioVenta,
                cantidad: el.cantidad != undefined ? el.cantidad : 0,
                fechaVenc: el.fechaVenc,
                isVencido: el.isVencido

              }

              detailArr.push(detail);

            })

            this.detailTable = detailArr;

            this.dataSource.data = this.detailTable;


          },
          error: err => {

          }
        })


      },
      error: err => {

      }
    })


  }

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      
    }
  }

  addInventario(index: number) {

    let dataDialog: dataDialog = {
      detalle: this.detallesProducto[index],
      type: 'plus'
    }

    console.log(dataDialog);

    const dialogRef = this.dialog.open(UpdateCantidadComponent, {
      panelClass: 'dialog-responsive-xl',
      data: dataDialog
    })

    dialogRef.afterClosed().subscribe({
      next: detalle => {
        if(detalle != undefined) {
          
          this.detallesProducto[index] = detalle;
          
          let detailArr: detailTable[] = [];

            this.detallesProducto.forEach(el => {

              let detail: detailTable = {
                id: el.id!,
                codigo: el.producto.codigo,
                nombre: el.producto.nombre,
                precioCompra: el.precioCompra,
                precioVenta: el.precioVenta,
                cantidad: el.cantidad != undefined ? el.cantidad : 0,
                fechaVenc: el.fechaVenc,
                isVencido: el.isVencido

              }

              detailArr.push(detail);

            })

            this.dataSource.data = detailArr;

          

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Cantidad actualizada',
            showConfirmButton: false,
            timer: 1500
          })
        }
      }
    })
  }

  minusInventario(index: number) {
    
    let dataDialog: dataDialog = {
      detalle: this.detallesProducto[index],
      type: 'minus'
    }

    console.log(dataDialog);

    const dialogRef = this.dialog.open(UpdateCantidadComponent, {
      panelClass: 'dialog-responsive-xl',
      data: dataDialog
    })

    dialogRef.afterClosed().subscribe({
      next: detalle => {
        if(detalle != undefined) {

          this.detallesProducto[index] = detalle;
          
          let detailArr: detailTable[] = [];

            this.detallesProducto.forEach(el => {

              let detail: detailTable = {
                id: el.id!,
                codigo: el.producto.codigo,
                nombre: el.producto.nombre,
                precioCompra: el.precioCompra,
                precioVenta: el.precioVenta,
                cantidad: el.cantidad != undefined ? el.cantidad : 0,
                fechaVenc: el.fechaVenc,
                isVencido: el.isVencido

              }

              detailArr.push(detail);

            })

            this.dataSource.data = detailArr;

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Cantidad actualizada',
            showConfirmButton: false,
            timer: 1500
          })
        }
      }
    })
  }

}
