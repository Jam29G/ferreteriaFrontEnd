import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DetalleProducto } from 'src/app/productos/interfaces/detalleProducto.interface';
import { DetallesService } from 'src/app/productos/services/detalles.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth/services/auth.service';

interface dataDialog {
  detalle: DetalleProducto,
  type: string
}


@Component({
  selector: 'app-update-cantidad',
  templateUrl: './update-cantidad.component.html',
  styleUrls: ['./update-cantidad.component.css']
})
export class UpdateCantidadComponent implements OnInit {

  get cantidadError(): string {
    const control = this.form.get('cantidad');

    if(control?.hasError('required')) {
      return "La cantidad es requerida";
    }

    if(control?.hasError('min')) return "La cantidad minima debe de ser mayor a 0";


    return "";
  }

  cantidad: number = 0;

  form: FormGroup = this.fb.group({
    cantidad: [this.cantidad, [ Validators.required, Validators.min(1) ] ],
  });

  constructor(
    private fb: FormBuilder,
    private detalleService: DetallesService,
    @Inject(MAT_DIALOG_DATA) public data: dataDialog,
    private dialogRef: MatDialogRef<UpdateCantidadComponent>,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {

  }

  submitForm() {
    this.form.markAllAsTouched();

    if(this.form.invalid) return
    
    let cantidad: number = this.form.get("cantidad")?.value;

    if(this.data.type == "plus") {
      this.data.detalle.cantidad! += cantidad;
      console.log(this.data.detalle)
      this.detalleService.updateCantidad(this.data.detalle, this.data.detalle.id!, this.authService.auth?.id!).subscribe({
        next: detalle => {
          console.log(detalle);
          this.dialogRef.close(detalle);
        },
        error: err => {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error al actualizar el detalle: ' + err.error.message,
            showConfirmButton: false,
            timer: 2800
          })
        }
      })
    } else {

      if(this.data.detalle.cantidad! < cantidad) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'No existe suficientes unidades para retirar',
          showConfirmButton: false,
          timer: 2800
        })
        this.dialogRef.close();
        return
      }

      this.data.detalle.cantidad! -= cantidad;
      this.detalleService.updateCantidad(this.data.detalle, this.data.detalle.id!, this.authService.auth?.id!).subscribe({
        next: detalle => {
          this.dialogRef.close(detalle);
        },
        error: err => {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error al actualizar el detalle: ' + err.error.message,
            showConfirmButton: false,
            timer: 2800
          })
        }
      })

    }

  }

  
  close() {
    this.dialogRef.close();
  }

  invalidField(campo: string) {
    return this.form.get(campo)?.invalid && this.form.get(campo)?.touched;
  }

}
