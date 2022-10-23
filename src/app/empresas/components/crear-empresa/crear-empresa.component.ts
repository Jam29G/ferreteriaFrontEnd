import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ValidatorService } from 'src/app/shared/validator/validator.service';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from '../../interfaces/empresa.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-empresa',
  templateUrl: './crear-empresa.component.html',
  styleUrls: ['./crear-empresa.component.css']
})
export class CrearEmpresaComponent implements OnInit {

  get nombreError(): string {

    const control = this.form.get('nombre');

    if(control?.hasError('required')) {
      return "El nombre es requerido";
    }

    if(control?.hasError('minlength')) return "El nombre debe tener un minimo de 6 caracteres";

    if(control?.hasError('maxlength')) return "El maximo de caracteres es 120";

    if(control?.hasError('pattern')) {
      return "El nombre solo puede tener letras";
    }
    return "";
  }

  get direccionError(): string {

    const control = this.form.get('direccion');

    if(control?.hasError('required')) {
      return "El nombre es requerido";
    }

    if(control?.hasError('minlength')) return "La direccion debe tener un minimo de 6 caracteres";

    if(control?.hasError('maxlength')) return "El maximo de caracteres es 230";

    if(control?.hasError('pattern')) {
      return "la direccion solo puede tener letras";
    }
    return "";
  }

  get telefonoError(): string {

    const control = this.form.get('telefono');

    if(control?.hasError('required')) {
      return "El telefono es requerido";
    }

    if(control?.hasError('minlength')) return "El telefono debe tener un minimo de 8 caracteres";

    if(control?.hasError('maxlength')) return "El maximo de caracteres es 9";

    if(control?.hasError('pattern')) {
      return "Formato de incorrecto, el formato debe de ser: 00000000 o 0000-0000";
    }
    return "";
  }

  get correoError(): string {

    const control = this.form.get('correo');

    if(control?.hasError('required')) {
      return "El correo es requerido";
    }

    if(control?.hasError('minlength')) return "El correo debe tener un minimo de 8 caracteres";

    if(control?.hasError('maxlength')) return "El maximo de caracteres es 244";

    if(control?.hasError('pattern')) {
      return "Formato de correo electronico invalido";
    }
    return "";
  }

  form: FormGroup = this.fb.group({
    nombre: ['', [ Validators.required , Validators.minLength(6), Validators.maxLength(120) ] ],
    direccion: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(230) ] ],
    telefono: ['', [ Validators.required, Validators.minLength(8), Validators.maxLength(9), Validators.pattern(this.vs.phoneNumber) ] ],
    correo: ['', [Validators.minLength(8), Validators.maxLength(244), Validators.pattern(this.vs.emailPattern) ] ],
  });

  constructor(
    private fb: FormBuilder,
    private vs: ValidatorService,
    private dialogRef: MatDialogRef<CrearEmpresaComponent>,
    private empresaService: EmpresaService
  ) { }

  ngOnInit(): void {
  }

  submitForm() {
    this.form.markAllAsTouched();

    if(this.form.invalid) return

    let empresa: Empresa = {
      nombre: this.form.get('nombre')?.value,
      direccion: this.form.get('direccion')?.value,
      telefono: this.form.get('telefono')?.value,
      estado: true
    }

    if(this.form.get('correo')?.value.length >= 8) {
      empresa.correo = this.form.get('correo')?.value;
    }

    this.empresaService.create(empresa).subscribe({
      next: empresa => {
        this.dialogRef.close(empresa);
      },
      error: err => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error al registrar la empresa: ' + err.error.message,
          showConfirmButton: false,
          timer: 2800
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

}
