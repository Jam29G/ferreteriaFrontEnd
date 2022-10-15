import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Role } from '../../interface/usuario.interface';
import { RolesService } from '../../services/roles.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorService } from '../../../shared/validator/validator.service';

@Component({
  selector: 'app-add-usuario',
  templateUrl: './add-usuario.component.html',
  styleUrls: ['./add-usuario.component.css']
})
export class AddUsuarioComponent implements OnInit {

  roles: Role[] | undefined;

  form: FormGroup = this.fb.group({
    nombre: ['', [ Validators.required, Validators.pattern(this.vs.namePattern) ]],
    apellido: ['', [ Validators.required, Validators.pattern(this.vs.namePattern) ] ],
    username: ['', [ Validators.required, Validators.pattern(this.vs.usernamePattern) ] ],
    password: ['', [ Validators.required, Validators.minLength(3) ] ],
    rol: ['ROLE_CAJERO', [ Validators.required ] ]
  });

  constructor(
    private rolService: RolesService,
    private fb: FormBuilder,
    private vs: ValidatorService
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
  }

  submitForm() {

    this.form.markAllAsTouched();

    console.log(this.form.value);
    console.log(this.form.valid);

    if(this.form.invalid) return
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

}
