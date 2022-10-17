import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidatorService } from 'src/app/shared/validator/validator.service';
import { RolesService } from '../../services/roles.service';
import { UsuariosService } from '../../services/usuarios.service';
import { Role, Usuario } from '../../interface/usuario.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-usuario',
  templateUrl: './update-usuario.component.html',
  styleUrls: ['./update-usuario.component.css']
})
export class UpdateUsuarioComponent implements OnInit {

  roles: Role[] | undefined;
  usuario: Usuario | undefined;

  get passwordError(): string {
    const control = this.form.get('password');

    if(control?.hasError('required')) {
      return "El password es requerido";
    }

    if(control?.hasError('minlength')) return "La contraseña debe tener un minimo de 3 caracteres";

    return "";
  }

  form: FormGroup = this.fb.group({

    password: ['', [ Validators.minLength(3) ] ],
    rol: [ "" , [ Validators.required ] ]
    
  });

  constructor(
    private rolService: RolesService,
    private usuarioService: UsuariosService,
    private fb: FormBuilder,
    private vs: ValidatorService,
    private dialogRef: MatDialogRef<UpdateUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) { }

  ngOnInit(): void {
    
    this.rolService.getAll().subscribe({
      next: roles => {
        this.roles = roles;
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

    this.usuarioService.getById(this.data).subscribe({
      next: usuario => {
        this.usuario = usuario;
        this.form.get("rol")?.setValue(this.findMostRol(this.usuario.roles));
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

  submitForm() {
    this.form.markAllAsTouched();

    if(this.form.invalid) return

    let rol: string = this.form.get('rol')?.value;

    let roles: Role[] = this.defineRols(rol);

    if(roles.length === 0) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Rol invalido',
        showConfirmButton: false,
        timer: 1500
      })

      return;
    }

    let usuarioUpdate: Usuario = {...this.usuario!};

    usuarioUpdate.password = this.form.get('password')?.value;
    usuarioUpdate.roles = roles;

    this.usuarioService.update(this.data, usuarioUpdate).subscribe({
      next: usuario => {

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Usuario actualizado correctamente',
          showConfirmButton: false,
          timer: 1500
        })

        this.dialogRef.close(usuario);

      },
      error: err => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error al insertar el usuario: ' + err.error.message,
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
  }

  close() {
    this.dialogRef.close();
  }

  invalidField(campo: string) {
    return this.form.get(campo)?.invalid && this.form.get(campo)?.touched;
  }

  roleConverter(rol: string): string {

    let newRol = "";

    switch(rol) {
      case "ROLE_ADMIN":
        newRol = "Administrador";
      break;
      case "ROLE_GERENTE":
        newRol = "Gerente";
      break;
      case "ROLE_CAJERO":
        newRol = "Cajero";
      break;
      default: 
        newRol = "Indefinido";
      break;

    }

    return newRol;

  }

  findMostRol(roles: Role[]): string {

    if(roles.findIndex( rol => rol.nombre == "ROLE_ADMIN" ) != -1) {
      return "ROLE_ADMIN"
    }

    if(roles.findIndex( rol => rol.nombre == "ROLE_GERENTE" ) != -1) {
      return "ROLE_GERENTE"
    }

    if(roles.findIndex( rol => rol.nombre == "ROLE_CAJERO" ) != -1) {
      return "ROLE_CAJERO"
    }

    return "";

  }

  defineRols(rol: string): Role[] {
    let roles: Role[] = [];

    switch(rol) {
      case "ROLE_CAJERO": 
        roles?.push(
          this.roles?.find(rol => rol.nombre === "ROLE_CAJERO")!
        );
      break;
      case "ROLE_GERENTE": 
        roles?.push(
          this.roles?.find(rol => rol.nombre === "ROLE_CAJERO")!
        );
        roles?.push(
          this.roles?.find(rol => rol.nombre === "ROLE_GERENTE")!
        );
      break;
      case "ROLE_ADMIN": 
        roles?.push(
          this.roles?.find(rol => rol.nombre === "ROLE_CAJERO")!
        );
        roles?.push(
          this.roles?.find(rol => rol.nombre === "ROLE_GERENTE")!
        );
        roles?.push(
          this.roles?.find(rol => rol.nombre === "ROLE_ADMIN")!
        );
      break;
    }

    return roles;

  }

}
