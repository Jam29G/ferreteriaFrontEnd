import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { ShowDetailsComponent } from '../../components/show-details/show-details.component';
import { Compra } from '../../interfaces/compra.interface';
import { ComprasService } from '../../services/compras.service';

@Component({
  selector: 'app-ver-compras',
  templateUrl: './ver-compras.component.html',
  styleUrls: ['./ver-compras.component.css']
})
export class VerComprasComponent implements OnInit {

  compras: Compra[] = [];

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
    
  });

  displayedColumns: string[] = ['id', 'numFactura', 'fechaCompra', 'monto', 'usuario', 'options'];
  dataSource!: MatTableDataSource<Compra>;
  @ViewChild("showPag") paginator!: MatPaginator;
  @ViewChild("showSort") sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    private comprasService: ComprasService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {

    let fechaHoy = new Date();

    let startStr = this.datePipe.transform(fechaHoy, 'yyyy-MM-dd');

    this.comprasService.getTodayCompras(startStr!).subscribe({
      next: compras => {
        
        this.compras = compras;

        this.dataSource = new MatTableDataSource(this.compras);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      },
      error: err => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al obtener las compras: ' + + err.error.message,
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
    
  }

  showDetalles(id: number) {
    let compra = this.compras.find(el => el.id! == id);

    this.dialog.open(ShowDetailsComponent, {
      panelClass: 'dialog-responsive-xl',
      data: compra
    })

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      
    }
  }

  filterByDate() {
    let start = this.range.get('start')?.value;
    let end = this.range.get('end')?.value;

    if(start == null || end == null) {
      return
    }

    let startStr = this.datePipe.transform(start, 'yyyy-MM-dd hh:mm');
    let endStr = this.datePipe.transform(end, 'yyyy-MM-dd hh:mm');

    this.comprasService.getComprasByRangeDate(startStr!, endStr!).subscribe({
      next: compras => {
        this.compras = compras;
        this.dataSource.data = this.compras;
      },
      error: err => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al obtener las compras: ' + + err.error.message,
          showConfirmButton: false,
          timer: 1500
        })
      }
    })

  }

}
