import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CajasService } from '../../services/cajas.service';
import { Caja } from '../../interfaces/caja.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aprob-cajas',
  templateUrl: './aprob-cajas.component.html',
  styleUrls: ['./aprob-cajas.component.css']
})
export class AprobCajasComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'saldoInic', 'saldoFinal', 'saldoIngr', 'fechaApertura', 'fechaCierre', 'encargado', 'usuario', 'acciones'];
  dataSource!: MatTableDataSource<Caja>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  _cajas: Caja[] = [];

  constructor(
    private cajaService: CajasService
  ) { }

  ngOnInit(): void {
    this.cajaService.getPendientesAprob().subscribe({
      next: cajas => {
        this._cajas = cajas;
        this.dataSource = new MatTableDataSource(this._cajas);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: err => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al obtener los registros: ' + + err.error.message,
          showConfirmButton: false,
          timer: 2800
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
