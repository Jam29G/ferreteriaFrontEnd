import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CajasService } from '../../services/cajas.service';
import { Caja } from '../../interfaces/caja.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-movimiento-caja',
  templateUrl: './movimiento-caja.component.html',
  styleUrls: ['./movimiento-caja.component.css']
})
export class MovimientoCajaComponent implements OnInit {

  get motivoError(): string {

    const control = this.form.get('motivo');

    if(control?.hasError('required')) {
      return "El motivo es requerido";
    }

    if(control?.hasError('minlength')) return "El motivo debe tener un minimo de 6 caracteres";

    return "";
  }

  get montoError(): string {
    const control = this.form.get('monto');

    if(control?.hasError('required')) {
      return "El monto es requerido";
    }

    if(control?.hasError('min')) {
      return "El monto debe ser mayor a 0";
    }

    return "";
  }

  form: FormGroup = this.fb.group({
    motivo: ['', [ Validators.required , Validators.minLength(6) ]],
    monto: ['', [Validators.required, Validators.min(0.01)]]
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MovimientoCajaComponent>,
    private cajaService: CajasService,
    @Inject(MAT_DIALOG_DATA) public data: Caja
  ) { }

  ngOnInit(): void {
  }


  invalidField(campo: string) {
    return this.form.get(campo)?.invalid && this.form.get(campo)?.touched;
  }

  submitForm() {

    this.form.markAllAsTouched;
    if(this.form.invalid) return;

    let motivo: string = this.form.get('motivo')?.value;
    let monto: number = this.form.get('monto')?.value;

    if(this.data.isIngreso) {
      this.cajaService.abonarCaja(this.data, monto, motivo).subscribe({
        next: caja => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Transaccion realizada correctamente',
            showConfirmButton: false,
            timer: 1500
          })
          this.dialogRef.close(caja);
        },
        error: err => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: `Error al realizar el ${this.data.isIngreso ? 'Abono' : 'retiro'}` + err.error.message,
            showConfirmButton: false,
            timer: 2500
          })
        }
      })
    }else {
      this.cajaService.emitirGasto(this.data, monto, motivo).subscribe({
        next: caja => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Transaccion realizada correctamente',
            showConfirmButton: false,
            timer: 1500
          })
          this.dialogRef.close(caja);
        },
        error: err => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: `Error al realizar el ${this.data.isIngreso ? 'Abono' : 'retiro'}` + err.error.message,
            showConfirmButton: false,
            timer: 2500
          })
        }
      })
    }

    
  }

  close() {
    this.dialogRef.close();
  }


}
