import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../interface/usuario.interface';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth/services/auth.service';


@Component({
  selector: 'app-adm-usuarios',
  templateUrl: './adm-usuarios.component.html',
  styleUrls: ['./adm-usuarios.component.css']
})
export class AdmUsuariosComponent implements OnInit {

  private usuarios: Usuario[] = [];

  constructor(
    private usuarioService: UsuariosService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getAll();
  }

  //Obtener todos los usuarios
  getAll() {
    this.usuarioService.getAll().subscribe({
      next: usuarios => {
        let index = usuarios.findIndex( user => user.id == this.authService.auth?.id );
        usuarios.splice(index, 1);
        this.usuarios = usuarios;
        console.log(this.usuarios);
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


}
