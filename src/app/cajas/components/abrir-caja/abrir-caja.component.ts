import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidatorService } from 'src/app/shared/validator/validator.service';
import { Caja, Usuario } from '../../interfaces/caja.interface';
import { CajasService } from '../../services/cajas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-abrir-caja',
  templateUrl: './abrir-caja.component.html',
  styleUrls: ['./abrir-caja.component.css']
})
export class AbrirCajaComponent implements OnInit {

  get nombreError(): string {

    const control = this.form.get('nombre');

    if(control?.hasError('required')) {
      return "El nombre es requerido";
    }

    if(control?.hasError('minlength')) return "El nombre debe tener un minimo de 3 caracteres";

    if(control?.hasError('pattern')) {
      return "El nombre de caja debe de estar en minusculas y poseer solo letras y numeros";
    }
    return "";
  }

  get montoError(): string {
    const control = this.form.get('monto');

    if(control?.hasError('required')) {
      return "El monto es requerido";
    }

    if(control?.hasError('min')) {
      return "El monto debe ser igual o mayor a 0";
    }

    return "";
  }

  form: FormGroup = this.fb.group({
    nombre: ['', [ Validators.required , Validators.minLength(3), Validators.pattern(this.vs.lowerLettersAndNumbers) ]],
    monto: ['', [Validators.required, Validators.min(0)]]
  });

  constructor(
    private fb: FormBuilder,
    private vs: ValidatorService,
    private dialogRef: MatDialogRef<AbrirCajaComponent>,
    private cajaService: CajasService,
    @Inject(MAT_DIALOG_DATA) public data: Usuario
  ) { }

  ngOnInit(): void {

  }

  submitForm() {
    this.form.markAllAsTouched;
    if(this.form.invalid) return;

    

    let caja: Caja = {
      nombre: this.form.get("nombre")?.value,
      saldo: this.form.get("monto")?.value,
      saldoInic: this.form.get("monto")?.value,
      estado: true,
      aprobacion: "P",
      usuario: this.data
    }

    this.cajaService.abrirCaja(caja).subscribe({
      next: caja => {

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Caja abierta correctamente',
          showConfirmButton: false,
          timer: 1500
        })

        this.dialogRef.close(caja);

      },
      error: err => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al abrir caja: ' + err.error.message,
          showConfirmButton: false,
          timer: 2500
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
