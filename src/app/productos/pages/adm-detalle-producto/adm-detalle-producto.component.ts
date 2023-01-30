import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { DetalleProducto } from '../../interfaces/detalleProducto.interface';
import { Producto } from '../../interfaces/producto.interface';
import { ProductoService } from '../../services/producto.service';
import { DetallesService } from '../../services/detalles.service';
import { identifierName } from '@angular/compiler';
import { AddDetalleProdComponent } from '../../components/detalle/add-detalle-prod/add-detalle-prod.component';
import { EditDetalleProdComponent } from '../../components/detalle/edit-detalle-prod/edit-detalle-prod.component';

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

@Component({
  selector: 'app-adm-detalle-producto',
  templateUrl: './adm-detalle-producto.component.html',
  styleUrls: ['./adm-detalle-producto.component.css']
})
export class AdmDetalleProductoComponent implements OnInit {

  //filtro
  myControl = new FormControl<string>('');
  productos: Producto[] = []; 
  producto: Producto | undefined;

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

  //Filtro
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

  add() {
    const dialogRef = this.dialog.open(AddDetalleProdComponent, {
      panelClass: 'dialog-responsive',
      data: this.producto
    });

    dialogRef.afterClosed().subscribe({
      next: response => {  
        if(response === undefined) return

        let detalleNuevo: DetalleProducto = response;

        let detail: detailTable = {
          id: detalleNuevo.id!,
          codigo: detalleNuevo.producto.codigo,
          nombre: detalleNuevo.producto.nombre,
          precioCompra: detalleNuevo.precioCompra,
          precioVenta: detalleNuevo.precioVenta,
          cantidad: detalleNuevo.cantidad != undefined ? detalleNuevo.cantidad : 0,
          fechaVenc: detalleNuevo.fechaVenc,
          isVencido: detalleNuevo.isVencido

        }

        this.detailTable.push(detail);
        this.dataSource.data = this.detailTable;

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Detalle creado correctamente',
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
  }

  update(id: number) {

    this.detallesService.getById(id).subscribe({
      next: detalle => {
        const dialogRef = this.dialog.open(EditDetalleProdComponent, {
          panelClass: 'dialog-responsive',
          data: detalle
        });

        dialogRef.afterClosed().subscribe({
          next: response => {  
            if(response === undefined) return
    
            let detalleNuevo: DetalleProducto = response;
    
            let detail: detailTable = {
              id: detalleNuevo.id!,
              codigo: detalleNuevo.producto.codigo,
              nombre: detalleNuevo.producto.nombre,
              precioCompra: detalleNuevo.precioCompra,
              precioVenta: detalleNuevo.precioVenta,
              cantidad: detalleNuevo.cantidad != undefined ? detalleNuevo.cantidad : 0,
              fechaVenc: detalleNuevo.fechaVenc,
              isVencido: detalleNuevo.isVencido
    
            }
    
            let index = this.detailTable.findIndex(el => el.id == detail.id);

            this.detailTable[index] = detail;
            
            this.dataSource.data = this.detailTable;
    
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Detalle creado correctamente',
              showConfirmButton: false,
              timer: 1500
            })
          }
        })

        
      },
      error: err => {

      }
    })


  }

  changeState(id: number, estado: boolean) {

    Swal.fire({
      title: `¿Seguro que quieres deshabilitar el detalle?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `deshabilitar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {

      if (result.isConfirmed) {

        this.detallesService.changeState(id, estado).subscribe({
          next: (response) => {
            let index: number = this.detailTable.findIndex( element => element.id == id );
            this.detailTable.splice(index, 1);

            this.dataSource.data = this.detailTable;

            Swal.fire({
              position: 'center',
              icon: 'success',
              title: `Deshabilitado correctamente`,
              showConfirmButton: false,
              timer: 1500
            })
          },
          error: (err) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: `Error al Deshabilitar la empresa: ${err.error.message}` ,
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



}
