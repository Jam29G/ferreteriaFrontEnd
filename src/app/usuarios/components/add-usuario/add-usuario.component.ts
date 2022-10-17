import { Component, Inject, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { Role, Usuario } from '../../interface/usuario.interface';
import { RolesService } from '../../services/roles.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorService } from '../../../shared/validator/validator.service';
import { UsernameValidatorService } from 'src/app/shared/validator/username-validator.service';
import { UsuariosService } from '../../services/usuarios.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-add-usuario',
  templateUrl: './add-usuario.component.html',
  styleUrls: ['./add-usuario.component.css']
})
export class AddUsuarioComponent implements OnInit, OnDestroy {

  get nombreError(): string {

    const control = this.form.get('nombre');

    if(control?.hasError('required')) {
      return "El nombre es requerido";
    }

    if(control?.hasError('minlength')) return "El nombre debe tener un minimo de 3 caracteres";

    if(control?.hasError('pattern')) {
      return "El nombre solo puede tener letras";
    }
    return "";
  }

  get apellidoError(): string {

    const control = this.form.get('apellido');

    if(control?.hasError('required')) {
      return "El apellido es requerido";
    }

    if(control?.hasError('minlength')) return "El apellido debe tener un minimo de 3 caracteres";

    if(control?.hasError('pattern')) {
      return "El apellido solo puede tener letras";
    }
    return "";
  }

  get usernameError(): string {
    const control = this.form.get('username');

    if(control?.hasError('required')) {
      return "El username es requerido";
    }

    if(control?.hasError('minlength')) return "El username debe tener un minimo de 3 caracteres";

    if(control?.hasError('pattern')) {
      return "El username no puede tener caracteres especiales como: ? @ $ %";
    }

    if(control?.hasError('usernameTomado')) {
      return "El username escrito no esta disponible";
    }

    return "";
  }

  get passwordError(): string {
    const control = this.form.get('password');

    if(control?.hasError('required')) {
      return "El password es requerido";
    }

    if(control?.hasError('minlength')) return "La contraseña debe tener un minimo de 3 caracteres";

    return "";
  }

  roles: Role[] | undefined;

  usuarios: Usuario[] = [];

  form: FormGroup = this.fb.group({
    nombre: ['', [ Validators.required , Validators.minLength(3), Validators.pattern(this.vs.namePattern) ]],
    apellido: ['', [ Validators.required, Validators.minLength(3), Validators.pattern(this.vs.namePattern) ] ],
    username: ['', [ Validators.required, Validators.minLength(3), Validators.pattern(this.vs.usernamePattern) ], [this.usernameValid] ],
    password: ['', [ Validators.required, Validators.minLength(3) ] ],
    rol: ['ROLE_CAJERO', [ Validators.required ] ]
  });

  constructor(
    private rolService: RolesService,
    private usuarioService: UsuariosService,
    private fb: FormBuilder,
    private vs: ValidatorService,
    private usernameValid: UsernameValidatorService,
    private dialogRef: MatDialogRef<AddUsuarioComponent>,
  ) { }

  ngOnDestroy(): void {
    this.dialogRef.close(this.usuarios);
  }

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

    let newUsuario: Usuario = {
      nombre:   this.form.get('nombre')?.value,
      apellido: this.form.get('apellido')?.value,
      username: this.form.get('username')?.value,
      password: this.form.get('password')?.value,
      estado:   true,
      roles:    roles
    }

    
    this.usuarioService.save(newUsuario).subscribe({
      next: usuario => {
        this.usuarios.push(usuario);
        this.form.reset({
          "rol": "ROLE_CAJERO"
        });
        console.log(this.form.untouched);

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Usuario insertado correctamente',
          showConfirmButton: false,
          timer: 1500
        })

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

  close() {
    this.dialogRef.close(this.usuarios);
  }

}
