import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DetalleCompra, Compra } from '../../interfaces/compra.interface';

@Component({
  selector: 'app-show-details',
  templateUrl: './show-details.component.html',
  styleUrls: ['./show-details.component.css']
})
export class ShowDetailsComponent implements OnInit {

  //Datatable
  displayedColumns: string[] = ['codigo', 'nombre', 'precio', 'cantidad'];
  dataSource!: MatTableDataSource<DetalleCompra>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Compra,
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.data.detalleCompra);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

}
