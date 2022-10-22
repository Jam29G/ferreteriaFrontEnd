import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UpdateUsuarioComponent } from 'src/app/usuarios/components/update-usuario/update-usuario.component';
import { Caja } from '../../interfaces/caja.interface';
import { MovimCaja } from '../../interfaces/movimCaja.interface';
import { CajasService } from '../../services/cajas.service';

interface Details {
  caja: Caja | undefined;
  ingrRegistros: MovimCaja[] | undefined;
  egresosRegistros: MovimCaja[] | undefined;
}

@Component({
  selector: 'app-show-details',
  templateUrl: './show-details.component.html',
  styleUrls: ['./show-details.component.css']
})
export class ShowDetailsComponent implements OnInit {

  get saldoRetirado(): number {
    let totalRetirado = 0;

    this.details.egresosRegistros?.forEach(registro => {
      totalRetirado += registro.monto;
    })

    return totalRetirado;
  }

  //Datatable
  //Datatable
  ingresosDisplayedColumns: string[] = ['motivo', 'monto', 'fecha', 'caja', 'usuario', 'venta'];
  ingresosCajaDataSource!: MatTableDataSource<MovimCaja>;

  egresosDisplayedColumns: string[] = ['motivo', 'monto', 'fecha', 'caja', 'usuario', 'venta'];
  egresosCajaDataSource!: MatTableDataSource<MovimCaja>;

  @ViewChild('ingrPag') ingresoPaginator!: MatPaginator;
  @ViewChild('ingrSort') ingresoSort!: MatSort;

  @ViewChild('egrPag') egresoPaginator!: MatPaginator;
  @ViewChild('egrSort') egresoSort!: MatSort;

  constructor(
    private dialogRef: MatDialogRef<UpdateUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public details: Details,
  ) { }

  ngOnInit(): void {
    
    this.ingresosCajaDataSource = new MatTableDataSource(this.details.ingrRegistros);
    this.ingresosCajaDataSource.paginator = this.ingresoPaginator;
    this.ingresosCajaDataSource.sort = this.ingresoSort;

    this.egresosCajaDataSource = new MatTableDataSource(this.details.egresosRegistros);
    this.egresosCajaDataSource.paginator = this.egresoPaginator;
    this.egresosCajaDataSource.sort = this.egresoSort;
  }

  close() {
    this.dialogRef.close();
  }

}
