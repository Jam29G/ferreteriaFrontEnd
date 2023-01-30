import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VentasService } from 'src/app/ventas/services/ventas.service';
import Swal from 'sweetalert2';
import { Inventario } from '../../interfaces/IInventario';
import { InventarioService } from '../../services/inventario.service';
import { Venta } from '../../../ventas/interfaces/Venta.interface';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  controlInventario: Inventario[] = [];

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
    
  });

  displayedColumns: string[] = ['producto', 'salida?', 'fechaMovimiento', 'usuario', 'observación', 'precioVenta', 'cantidad', 'monto'];
  dataSource!: MatTableDataSource<Inventario>;
  @ViewChild("showPag") paginator!: MatPaginator;
  @ViewChild("showSort") sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    private inventarioService: InventarioService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {


    this.inventarioService.getRecordsToday().subscribe({
      next: controlInv => {
        this.controlInventario = controlInv;
        this.dataSource = new MatTableDataSource(this.controlInventario);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.dataSource.filterPredicate = (data: Inventario, filter: string) => {
          if(data.producto.nombre.toLocaleLowerCase().includes(filter.toLocaleLowerCase())) {
            return true
          };
          if(data.usuario.username.toLocaleLowerCase().includes(filter.toLocaleLowerCase())) return true
          if(data.observacion.toLocaleLowerCase().includes(filter.toLocaleLowerCase())) return true
          if(data.usuario.nombre.toLocaleLowerCase().includes(filter.toLocaleLowerCase())) return true
          if(data.cantidad.toString().includes(filter)) return true
          if(data.precioVenta.toString().includes(filter)) return true
          return false;
        }
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

  filterByDate() {
    let start = this.range.get('start')?.value;
    let end = this.range.get('end')?.value;

    if(start == null || end == null) {
      return
    }

    let startStr = this.datePipe.transform(start, 'yyyy-MM-dd hh:mm');
    let endStr = this.datePipe.transform(end, 'yyyy-MM-dd hh:mm');

    this.inventarioService.getByRange(startStr!, endStr!).subscribe({
      next: controlInv => {
        this.controlInventario = controlInv;
        this.dataSource.data = this.controlInventario;
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
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      
    }
  }

}
