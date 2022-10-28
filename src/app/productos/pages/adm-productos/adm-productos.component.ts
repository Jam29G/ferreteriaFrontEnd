import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Producto, Proveedor } from '../../interfaces/producto.interface';
import { ProductoService } from '../../services/producto.service';
import Swal from 'sweetalert2';
import { CrearProductoComponent } from '../../components/crear-producto/crear-producto.component';
import { AddProveedroComponent } from '../../components/add-proveedro/add-proveedro.component';
import { Empresa } from '../../../empresas/interfaces/empresa.interface';
import { AddUbicacionesComponent } from '../../components/add-ubicaciones/add-ubicaciones.component';
import { RemoveProveedoresComponent } from '../../components/remove-proveedores/remove-proveedores.component';
import { RemoveUbicacionesComponent } from '../../components/remove-ubicaciones/remove-ubicaciones.component';
import { UpdateProductoComponent } from '../../components/update-producto/update-producto.component';

@Component({
  selector: 'app-adm-productos',
  templateUrl: './adm-productos.component.html',
  styleUrls: ['./adm-productos.component.css']
})
export class AdmProductosComponent implements OnInit {

  //Datatable
  displayedColumns: string[] = ['codigo', 'nombre', 'descuentoMax', 'descripcion', 'perecedero', 'options'];
  dataSource!: MatTableDataSource<Producto>;

  dataSource2!: MatTableDataSource<Producto>;

  @ViewChild("showPag") paginator!: MatPaginator;
  @ViewChild("showSort") sort!: MatSort;

  @ViewChild("editPag") paginatorEdit!: MatPaginator;
  @ViewChild("editSort") sortEdit!: MatSort;

  productos: Producto[] = [];
  productosEdit: Producto[] = [];

  desChecked: boolean = false;

  constructor(
    public dialog: MatDialog,
    private productoService: ProductoService
  ) { }

  ngOnInit(): void {
    this.productoService.getAll(true).subscribe({
      next: productos => {
        this.productos = productos;
        this.productosEdit = productos

        this.dataSource = new MatTableDataSource(this.productos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.dataSource2 = new MatTableDataSource(this.productosEdit);
        this.dataSource.paginator = this.paginatorEdit;
        this.dataSource.sort = this.sortEdit;

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



  
  createProducto() {

    const dialogRef = this.dialog.open(CrearProductoComponent, {
      panelClass: 'dialog-responsive'
    });

    dialogRef.afterClosed().subscribe({
      next: res => {
        if(res !== undefined) {
          let newProd = res;
          this.productos.push(newProd);
          this.dataSource.data = this.productos;

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Producto registrado correctamente',
            showConfirmButton: false,
            timer: 1500
          })
        }
      }
    })


    
  }

  updateProducto(id: number) {

    this.productoService.getById(id).subscribe({
      next: prod => {
        const dialogRef = this.dialog.open(UpdateProductoComponent, {
          panelClass: 'dialog-responsive',
          data: prod
        });
    
        dialogRef.afterClosed().subscribe({
          next: res => {
            if(res !== undefined) {
              let updateProd = res;
              let index = this.productos.findIndex(el => el.id! == id);
            
              this.productos[index] = updateProd;
              this.dataSource.data = this.productos;
    
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Producto actualizado correctamente',
                showConfirmButton: false,
                timer: 1500
              })
            }
          }
        })
      },
      error: err => {

      }
    })

    

  }

  change(event: any) {

    this.desChecked = event.checked;
    this.getAll(!event.checked)
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

  changeState(id: number, estado: boolean) {
    let title: string = estado ? "habilitar" : "deshabilitar";

    Swal.fire({
      title: `¿Seguro que quieres ${title} el usuario?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `${title}`,
      denyButtonText: `Cancelar`,
    }).then((result) => {

      if (result.isConfirmed) {

        this.productoService.changeState(id, estado).subscribe({
          next: (response) => {
            let index: number = this.productos.findIndex( element => element.id == id );
            this.productos.splice(index, 1);

            this.dataSource.data = this.productos;

            Swal.fire({
              position: 'center',
              icon: 'success',
              title: `${estado ? "habilitado" : "deshabilitado"} correctamente`,
              showConfirmButton: false,
              timer: 1500
            })
          },
          error: (err) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: `Error al ${title} al producto: ${err.error.message}` ,
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

  addProv(id: number) {

    this.productoService.getById(id).subscribe({

      next: prod => {

        this.dialog.open(AddProveedroComponent, {
          panelClass: 'dialog-responsive-xl',
          data: prod
          
        })



      },

      error: err => {

      }
    })

    
  }

  deleteProv(id: number) {

    this.productoService.getById(id).subscribe({

      next: prod => {

        this.dialog.open(RemoveProveedoresComponent, {
          panelClass: 'dialog-responsive-xl',
          data: prod
          
        })



      },

      error: err => {

      }
    })

    
  }

  addUbic(id: number) {
    this.productoService.getById(id).subscribe({

      next: prod => {

        this.dialog.open(AddUbicacionesComponent, {
          panelClass: 'dialog-responsive-xl',
          data: prod
          
        })



      },

      error: err => {

      }
    })
  }

  deleteUbic(id: number) {
    this.productoService.getById(id).subscribe({

      next: prod => {

        this.dialog.open(RemoveUbicacionesComponent, {
          panelClass: 'dialog-responsive-xl',
          data: prod
          
        })



      },

      error: err => {

      }
    })
  }

  changeStateProducto(id: number, estado: boolean) {

  }

  showDetails(id: number) {
    
  }

  applyFilter(event: any) {

    const filterValue = (event.target as HTMLInputElement).value;

    if(filterValue.trim().length == 0) {
      this.productoService.getAll(!this.desChecked).subscribe({
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
    
    this.productoService.findProductos(filterValue, !this.desChecked).subscribe({
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

  applyFilter2(event: any) {

    const filterValue = (event.target as HTMLInputElement).value;

    if(filterValue.trim().length == 0) {
      this.productoService.getAll(!this.desChecked).subscribe({
        next: productos => {
          this.productos = productos;
          this.dataSource2.data = this.productos;
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
    
    this.productoService.findProductos(filterValue, !this.desChecked).subscribe({
      next: productos => {
        this.productos = productos;
        this.dataSource2.data = this.productos;
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

  changeStatus(event: any) {

  }

}
