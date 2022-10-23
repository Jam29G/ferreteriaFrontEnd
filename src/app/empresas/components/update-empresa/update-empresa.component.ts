import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidatorService } from 'src/app/shared/validator/validator.service';
import { Empresa } from '../../interfaces/empresa.interface';
import { EmpresaService } from '../../services/empresa.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-empresa',
  templateUrl: './update-empresa.component.html',
  styleUrls: ['./update-empresa.component.css']
})
export class UpdateEmpresaComponent implements OnInit {

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
    direccion: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(230) ] ],
    telefono: ['', [ Validators.required, Validators.minLength(8), Validators.maxLength(9), Validators.pattern(this.vs.phoneNumber) ] ],
    correo: ['', [Validators.minLength(8), Validators.required, Validators.maxLength(244), Validators.pattern(this.vs.emailPattern) ] ],
  });

  constructor(
    private fb: FormBuilder,
    private vs: ValidatorService,
    private dialogRef: MatDialogRef<UpdateEmpresaComponent>,
    private empresaService: EmpresaService,
    @Inject(MAT_DIALOG_DATA) public empresa: Empresa
  ) { }

  ngOnInit(): void {
    this.form.get('direccion')?.setValue(this.empresa.direccion);
    this.form.get('telefono')?.setValue(this.empresa.telefono);
    this.form.get('correo')?.setValue(this.empresa.correo);
  }

  submitForm() {
    this.form.markAllAsTouched();

    if(this.form.invalid) return

    this.empresa.direccion = this.form.get('direccion')?.value;
    this.empresa.correo = this.form.get('correo')?.value;
    this.empresa.telefono = this.form.get('telefono')?.value;

    this.empresaService.update(this.empresa, this.empresa.id!).subscribe({
      next: empresa => {
        this.dialogRef.close(empresa);
      },
      error: err => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error al actualizar la empresa: ' + err.error.message,
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
