import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Empresa } from '../../interfaces/empresa.interface';
import { EmpresaService } from '../../services/empresa.service';
import Swal from 'sweetalert2';
import { CrearEmpresaComponent } from '../../components/crear-empresa/crear-empresa.component';
import { UpdateEmpresaComponent } from '../../components/update-empresa/update-empresa.component';

@Component({
  selector: 'app-adm-empresas',
  templateUrl: './adm-empresas.component.html',
  styleUrls: ['./adm-empresas.component.css']
})
export class AdmEmpresasComponent implements OnInit {

  //Datatable
  displayedColumns: string[] = ['nombre', 'direccion', 'telefono', 'correo', 'options'];
  dataSource!: MatTableDataSource<Empresa>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  empresas: Empresa[] = [];
  desChecked: boolean = false;

  constructor(
    private empresaService: EmpresaService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {

    this.empresaService.getAll(true).subscribe({
      next: empresas => {
        this.empresas = empresas;
        this.dataSource = new MatTableDataSource(this.empresas);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
  }

  //Buscador por nombre, telefono y correo
  applyFilter(event: Event) {
    
    const filterValue = (event.target as HTMLInputElement).value;
    
    this.empresaService.findEmpresa(filterValue, !this.desChecked).subscribe({
      next: empresas => {
        this.empresas = empresas;
        this.dataSource.data = this.empresas;
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

  getAll(estado: boolean) {
    this.empresaService.getAll(estado).subscribe({
      next: empresas => {

        this.empresas = empresas;
        
        this.dataSource.data = this.empresas;
        //this.dataSource.paginator = this.paginator;
        
      },
      error: err => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al obtener las empresas: ' + + err.error.message,
          showConfirmButton: false,
          timer: 2800
        })
      }
    })
  }

  changeStatus(event: any) {

    this.desChecked = event.checked;
    this.getAll(!event.checked)
  }

  createEmpresa() {
    const dialogRef = this.dialog.open(CrearEmpresaComponent, {
      panelClass: 'dialog-responsive'
    });

    dialogRef.afterClosed().subscribe({
      next: response => {

        if(response !== undefined) {
          let newEmpresa = response;
          this.empresas.push(newEmpresa);
          this.dataSource.data = this.empresas;

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Empresa registrada correctamente',
            showConfirmButton: false,
            timer: 1500
          })

        }

      }
    })
  }

  updateEmpresa(id: number) {

    this.empresaService.getById(id)
    .subscribe({

      next: empresa => {

        const dialogRef = this.dialog.open(UpdateEmpresaComponent, {
          panelClass: 'dialog-responsive',
          data: empresa
        });
    
        dialogRef.afterClosed().subscribe({
          next: response => {  
            if(response === undefined) return

            let index = this.empresas.findIndex(el => el.id === id);
            this.empresas[index] = response;
            this.dataSource.data = this.empresas;

            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Empresa modificada correctamente',
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

  changeStateEmpresa(id: number, estado: boolean) {
    let title: string = estado ? "habilitar" : "deshabilitar";

    Swal.fire({
      title: `¿Seguro que quieres ${title} la empresa?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `${title}`,
      denyButtonText: `Cancelar`,
    }).then((result) => {

      if (result.isConfirmed) {

        this.empresaService.changeState(id, estado).subscribe({
          next: (response) => {
            let index: number = this.empresas.findIndex( element => element.id == id );
            this.empresas.splice(index, 1);

            this.dataSource.data = this.empresas;

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
              title: `Error al ${title} la empresa: ${err.error.message}` ,
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
