import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario, Role } from '../../interface/usuario.interface';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth/services/auth.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AddUsuarioComponent } from '../../components/add-usuario/add-usuario.component';


@Component({
  selector: 'app-adm-usuarios',
  templateUrl: './adm-usuarios.component.html',
  styleUrls: ['./adm-usuarios.component.css']
})
export class AdmUsuariosComponent implements OnInit, AfterViewInit {

  //Datatable
  displayedColumns: string[] = ['nombre', 'apellido', 'username', 'rolstr', 'options'];
  dataSource!: MatTableDataSource<Usuario>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  usuarios: Usuario[] = [];

  constructor(
    private usuarioService: UsuariosService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {  }

  ngAfterViewInit() {
    
    
    
  }

  ngOnInit(): void {
    this.usuarioService.getAll(true).subscribe({
      next: usuarios => {
        let index = usuarios.findIndex( user => user.id == this.authService.auth?.id );
        usuarios.splice(index, 1);
        this.usuarios = usuarios;

        this.usuarios.forEach(usuario => {
          usuario.rolstr = this.roleConverter(usuario.roles);
        })

        this.dataSource = new MatTableDataSource(this.usuarios);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        
      },
      error: err => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al obtener los usuarios: ' + + err.error.message,
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
    
  }

  getAll(estado: boolean) {
    this.usuarioService.getAll(estado).subscribe({
      next: usuarios => {
        //let index = usuarios.findIndex( user => user.id == this.authService.auth?.id );
        //usuarios.splice(index, 1);
        this.usuarios = usuarios;
        this.usuarios.forEach(usuario => {
          usuario.rolstr = this.roleConverter(usuario.roles);
        })
        this.dataSource.data = this.usuarios;
        //this.dataSource.paginator = this.paginator;
        
      },
      error: err => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al obtener los usuarios: ' + + err.error.message,
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
  }

  changeStatus(event: any) {

 
    this.getAll(!event.checked)
  }

  roleConverter(roles: Role[]): string {

    if(roles.findIndex( rol => rol.nombre === "ROLE_ADMIN" ) != -1) {
      return "Administrador"
    } else if(roles.findIndex( rol => rol.nombre === "ROLE_GERENTE") != -1) {
      return "Gerente"
    } else {
      return "Cajero"
    }

  }

  add() {

    this.dialog.open(AddUsuarioComponent, {
      panelClass: 'dialog-responsive'
    });
    

    //this.usuarios.push(usuario);
    //this.dataSource.data = this.usuarios;

  }

  elimiar(index: number) {
    this.usuarios.splice(index, 1);
    this.dataSource.data = this.usuarios;
  } 


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      
    }
  }

}

