import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DetallesService } from 'src/app/productos/services/detalles.service';
import Swal from 'sweetalert2';
import { DetalleProducto } from '../../../interfaces/detalleProducto.interface';
import { AddDetalleProdComponent } from '../add-detalle-prod/add-detalle-prod.component';

@Component({
  selector: 'app-edit-detalle-prod',
  templateUrl: './edit-detalle-prod.component.html',
  styleUrls: ['./edit-detalle-prod.component.css']
})
export class EditDetalleProdComponent implements OnInit {

  get precioVentaError(): string {
    const control = this.form.get('precioVenta');

    if(control?.hasError('required')) {
      return "El precio de venta es requerido";
    }

    if(control?.hasError('minlength')) return "precio minimo no validdo";


    return "";
  }

  form: FormGroup = this.fb.group({
    precioVenta: [this.detalle.precioVenta, [ Validators.required, Validators.min(0) ] ],
  });

  constructor(
    private fb: FormBuilder,
    private detalleService: DetallesService,
    @Inject(MAT_DIALOG_DATA) public detalle: DetalleProducto,
    private dialogRef: MatDialogRef<AddDetalleProdComponent>,
  ) { }

  ngOnInit(): void {
  }

  submitForm() {

    this.form.markAllAsTouched();

    if(this.form.invalid) return

    let precioVenta: number = this.form.get("precioVenta")?.value;
    
    if(this.detalle.precioCompra > precioVenta) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'El precio de compra no puede ser mayor al precio de venta',
        showConfirmButton: false,
        timer: 2800
      })
      return
    }

    this.detalle.precioVenta = precioVenta;

    this.detalleService.update(this.detalle, this.detalle.id!).subscribe({
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


  close() {
    this.dialogRef.close();
  }

  invalidField(campo: string) {
    return this.form.get(campo)?.invalid && this.form.get(campo)?.touched;
  }

}
