import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Producto } from '../../interfaces/producto.interface';
import { AddProveedroComponent } from '../add-proveedro/add-proveedro.component';
import { AuthService } from '../../../auth/services/auth.service';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DetallesService } from '../../services/detalles.service';

interface detailTable {
  id: number;
  codigo: string;
  nombre: string;
  precioVenta: number;
  cantidad?: number;
  fechaVenc?: Date;
}

@Component({
  selector: 'app-show-detail-productos',
  templateUrl: './show-detail-productos.component.html',
  styleUrls: ['./show-detail-productos.component.css']
})
export class ShowDetailProductosComponent implements OnInit {

  detailTable: detailTable[] = [];

    //Datatable
    displayedColumns: string[] = ['precioVenta', 'cantidad', 'fechaVenc'];
    dataSource!: MatTableDataSource<detailTable>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialogRef: MatDialogRef<AddProveedroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Producto,
    public authService: AuthService,
    private detallesService: DetallesService,
  ) { }

  ngOnInit(): void {
    
    this.detallesService.getByProductoId(this.data.id!, true).subscribe({
      next: detalles => {
        
        let detailArr: detailTable[] = [];

        detalles.forEach(el => {

          let detail: detailTable = {
            id: el.id!,
            codigo: el.producto.codigo,
            nombre: el.producto.nombre,
   
            precioVenta: el.precioVenta,
            cantidad: el.cantidad != undefined ? el.cantidad : 0,
            fechaVenc: el.fechaVenc,
    

          }

          detailArr.push(detail);

        })

        this.detailTable = detailArr;

        this.dataSource = new MatTableDataSource(this.detailTable);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;


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

}
