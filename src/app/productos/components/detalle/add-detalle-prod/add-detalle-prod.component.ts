import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Producto } from 'src/app/productos/interfaces/producto.interface';
import Swal from 'sweetalert2';
import { DetallesService } from '../../../services/detalles.service';
import { DetalleProducto } from '../../../interfaces/detalleProducto.interface';


@Component({
  selector: 'app-add-detalle-prod',
  templateUrl: './add-detalle-prod.component.html',
  styleUrls: ['./add-detalle-prod.component.css']
})
export class AddDetalleProdComponent implements OnInit {

  get precioCompraError(): string {
    const control = this.form.get('precioCompra');

    if(control?.hasError('required')) {
      return "El precio de compra es requerido";
    }

    if(control?.hasError('minlength')) return "precio minimo no validdo";

    return "";
  }

  get precioVentaError(): string {
    const control = this.form.get('precioVenta');

    if(control?.hasError('required')) {
      return "El precio de venta es requerido";
    }

    if(control?.hasError('minlength')) return "precio minimo no validdo";


    return "";
  }

  form: FormGroup = this.fb.group({
    precioCompra: ['', [ Validators.required, Validators.min(0) ] ],
    precioVenta: ['', [ Validators.required, Validators.min(0) ] ],
  });

  formPer: FormGroup = this.fb.group({
    precioCompra: ['', [ Validators.required, Validators.min(0) ] ],
    precioVenta: ['', [ Validators.required, Validators.min(0) ] ],
    fechaVenc: ['', [ Validators.required ] ],
  });

  constructor(
    private fb: FormBuilder,
    private detalleService: DetallesService,
    @Inject(MAT_DIALOG_DATA) public producto: Producto,
    private dialogRef: MatDialogRef<AddDetalleProdComponent>,
  ) { }

  ngOnInit(): void {

  }

  submitForm() {
    if(!this.producto.isPerecedero) {

      this.form.markAllAsTouched();

      if(this.form.invalid) return

      let precioCompra: number = this.form.get("precioCompra")?.value;
      let precioVenta: number = this.form.get("precioVenta")?.value;

      console.log(`Precio venta: ${precioVenta} precio compra: ${precioCompra}`);

      let productoDetailNew: DetalleProducto = {
        precioCompra:  precioCompra,
        precioVenta:   precioVenta,
        is_perecedero: false,
        estado:        true,
        producto:      this.producto
      }

      this.detalleService.create(productoDetailNew).subscribe({
        next: detalle => {

          this.dialogRef.close(detalle);

        },
        error: err => {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error al agregar detalle: ' + err.error.message,
            showConfirmButton: false,
            timer: 2800
          })
        }
      })
      

    } else {

      this.formPer.markAllAsTouched();
      if(this.formPer.invalid) return

      let nowDate: Date = new Date();

      let precioCompra: number = this.formPer.get("precioCompra")?.value;
      let precioVenta: number = this.formPer.get("precioVenta")?.value;
      let fechaVenc: Date = this.formPer.get("fechaVenc")?.value;

      if(fechaVenc <= nowDate) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'La fecha de vencimiento no puede ser menor a la fecha actual',
          showConfirmButton: false,
          timer: 2800
        })
        return
      }

      let productoDetailNew: DetalleProducto = {
        precioCompra:  precioCompra,
        precioVenta:   precioVenta,
        fechaVenc:     fechaVenc,
        isVencido:     false,
        is_perecedero: true,
        estado:        true,
        producto:      this.producto
      }

      this.detalleService.create(productoDetailNew).subscribe({
        next: detalle => {

          this.dialogRef.close(detalle);

        },
        error: err => {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error al agregar detalle: ' + err.error.message,
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
