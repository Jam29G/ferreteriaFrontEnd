import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DetalleVenta, Venta } from '../../interfaces/Venta.interface';

@Component({
  selector: 'app-show-venta-detalles',
  templateUrl: './show-venta-detalles.component.html',
  styleUrls: ['./show-venta-detalles.component.css']
})
export class ShowVentaDetallesComponent implements OnInit {

  //Datatable
  displayedColumns: string[] = ['codigo', 'nombre', 'precio', 'cantidad', 'descuento'];
  dataSource!: MatTableDataSource<DetalleVenta>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Venta,
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.data.detalleVentas);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
