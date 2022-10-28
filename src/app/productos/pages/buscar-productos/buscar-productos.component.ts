import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Producto } from '../../interfaces/producto.interface';
import { ProductoService } from '../../services/producto.service';
import { ShowDetailProductosComponent } from '../../components/show-detail-productos/show-detail-productos.component';

@Component({
  selector: 'app-buscar-productos',
  templateUrl: './buscar-productos.component.html',
  styleUrls: ['./buscar-productos.component.css']
})
export class BuscarProductosComponent implements OnInit {

  

  productos: Producto[] = [];

  displayedColumns: string[] = ['codigo', 'nombre', 'descuentoMax', 'descripcion', 'perecedero', 'options'];
  dataSource!: MatTableDataSource<Producto>;

  @ViewChild("showPag") paginator!: MatPaginator;
  @ViewChild("showSort") sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    private productoService: ProductoService
  ) { }

  ngOnInit(): void {
    this.productoService.getAll(true).subscribe({
      next: productos => {
        this.productos = productos;

        this.dataSource = new MatTableDataSource(this.productos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;


      },
      error: err => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al obtener los productos: ' + err.error.message,
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
  }

  getAll(estado: boolean) {
    this.productoService.getAll(estado).subscribe({
      next: productos => {

        this.productos = productos;

        this.dataSource.data = this.productos;
        //this.dataSource.paginator = this.paginator;
        
      },
      error: err => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al obtener los productos: ' + + err.error.message,
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
  }

  showDetalles(id: number) {

    this.productoService.getById(id).subscribe({
      next: producto => {
        this.dialog.open(ShowDetailProductosComponent, {
          panelClass: 'dialog-responsive-xl',
          data: producto
        });
      },
      error: err => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al obtener los productos: ' + + err.error.message,
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
    
  }

  applyFilter(event: any) {

    const filterValue = (event.target as HTMLInputElement).value;

    if(filterValue.trim().length == 0) {
      this.productoService.getAll(true).subscribe({
        next: productos => {
          this.productos = productos;
          this.dataSource.data = this.productos;
        },
        error: err => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Error al obtener los productos: ' + err.error.message,
            showConfirmButton: false,
            timer: 1500
          })
        }
      })

      return
    }
    
    this.productoService.findProductos(filterValue, true).subscribe({
      next: productos => {
        this.productos = productos;
        this.dataSource.data = this.productos;
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


    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      
    }
  }

}
