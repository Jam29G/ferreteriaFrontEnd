import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ValidatorService } from 'src/app/shared/validator/validator.service';
import Swal from 'sweetalert2';
import { Ubicacion } from '../../interfaces/ubicacion.interface';
import { UbicacionService } from '../../services/ubicacion.service';


@Component({
  selector: 'app-crear-ubicacion',
  templateUrl: './crear-ubicacion.component.html',
  styleUrls: ['./crear-ubicacion.component.css']
})
export class CrearUbicacionComponent implements OnInit {

  get zonaError(): string {

    const control = this.form.get('zona');

    if(control?.hasError('required')) {
      return "la zona es requerida";
    }

    if(control?.hasError('minlength')) return "La zona debe tener un minimo de 4 caracteres";

    if(control?.hasError('maxlength')) return "El maximo de caracteres es 120";

    return "";
  }

  get lugarError(): string {

    const control = this.form.get('lugar');

    if(control?.hasError('required')) {
      return "el lugar es requerido";
    }

    if(control?.hasError('minlength')) return "El lugar debe tener un minimo de 4 caracteres";

    if(control?.hasError('maxlength')) return "El maximo de caracteres es 120";

    if(control?.hasError('pattern')) {
      return "El campo solo puede poseer letras";
    }

    return "";
  }

  get numeroError(): string {

    const control = this.form.get('numero');

    if(control?.hasError('required')) {
      return "el numero es requerido";
    }

    if(control?.hasError('minlength')) return "El numero debe tener un minimo de 1 caracteres";

    if(control?.hasError('maxlength')) return "El maximo de caracteres es 10";

    if(control?.hasError('pattern')) {
      return "El campo solo puede poseer numeros";
    }

    return "";
  }

  

  form: FormGroup = this.fb.group({
    zona: ['', [ Validators.required , Validators.minLength(4), Validators.maxLength(120) ] ],
    lugar: ['', [ Validators.required, Validators.minLength(4), Validators.maxLength(120), Validators.pattern(this.vs.onlyLetters) ] ],
    numero: ['', [ Validators.required, Validators.minLength(1), Validators.maxLength(10), Validators.pattern(this.vs.onlyNumbers) ]]

  })

  constructor(
    private fb: FormBuilder,
    private vs: ValidatorService,
    private dialogRef: MatDialogRef<CrearUbicacionComponent>,
    private ubicacionService: UbicacionService
  ) { }

  ngOnInit(): void {
  }



  submitForm() {
    this.form.markAllAsTouched();

    if(this.form.invalid) return

    let ubicacion: Ubicacion = {
      zona: this.form.get('zona')?.value.toLocaleLowerCase(),
      lugar: this.form.get('lugar')?.value.toLocaleLowerCase(),
      numero: this.form.get('numero')?.value
    }

    this.ubicacionService.save(ubicacion).subscribe({
      next: ubicacion => {
        this.dialogRef.close(ubicacion);
      },
      error: err => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error al registrar la ubicacion: ' + err.error.message,
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
