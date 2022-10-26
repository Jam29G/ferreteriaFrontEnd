import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ValidatorService } from 'src/app/shared/validator/validator.service';
import { ProductoService } from '../../services/producto.service';
import Swal from 'sweetalert2';
import { Producto } from '../../interfaces/producto.interface';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css']
})
export class CrearProductoComponent implements OnInit {

  srcResult: any;

  img: File | undefined;

  get codigoError(): string {

    const control = this.form.get('codigo');

    if(control?.hasError('required')) {
      return "El codigo es requerido";
    }

    if(control?.hasError('minlength')) return "El codigo debe tener un minimo de 6 caracteres";

    if(control?.hasError('maxlength')) return "El maximo de caracteres es 6";

    if(control?.hasError('pattern')) {
      return "El codigo solo puede tener letras";
    }
    return "";
  }

  get nombreError(): string {

    const control = this.form.get('nombre');

    if(control?.hasError('required')) {
      return "El nombre es requerido";
    }

    if(control?.hasError('minlength')) return "El nombre debe tener un minimo de 3 caracteres";

    if(control?.hasError('maxlength')) return "El maximo de caracteres es 80";

    if(control?.hasError('pattern')) {
      return "El nombre solo puede tener letras";
    }
    return "";
  }

  get descuentoError(): string {

    const control = this.form.get('descuento');

    if(control?.hasError('required')) {
      return "El descuento es requerido";
    }

    if(control?.hasError('minlength')) return "El descuento debe tener un minimo de 6 caracteres";

    if(control?.hasError('max')) return "El descuento maximo es 1";

    if(control?.hasError('maxlength')) return "El maximo de caracteres es 120";

    if(control?.hasError('pattern')) {
      return "El descuento solo puede tener letras";
    }
    return "";
  }

  get descripcionError(): string {

    const control = this.form.get('descripcion');

    if(control?.hasError('required')) {
      return "la descripcion es requerida";
    }

    if(control?.hasError('minlength')) return "la descripcion debe tener un minimo de 6 caracteres";

    if(control?.hasError('maxlength')) return "El maximo de caracteres es 244";

    if(control?.hasError('pattern')) {
      return "la descripcion solo puede tener letras";
    }
    return "";
  }

  get perecederoError(): string {

    const control = this.form.get('imagen');

    if(control?.hasError('required')) {
      return "si el producto es perecedero es requerido";
    }

    return "";
  }

  form: FormGroup = this.fb.group({
    codigo: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(6) ] ],
    nombre: ['', [ Validators.required, Validators.minLength(3), Validators.maxLength(80) ] ],
    descuento: ['', [ Validators.required, Validators.max(1) ] ],
    descripcion: ['', [Validators.required, Validators.maxLength(244)] ],
    perecedero: ['false', [Validators.required] ],
  });

  constructor(
    private fb: FormBuilder,
    private vs: ValidatorService,
    private dialogRef: MatDialogRef<CrearProductoComponent>,
    private productoService: ProductoService
  ) { }

  ngOnInit(): void {
  }


  close() {
    this.dialogRef.close();
  }

  submitForm() {
    this.form.markAllAsTouched();

    if(this.form.invalid) return

    let producto: Producto = {
      codigo:       this.form.get('codigo')?.value,
      nombre:       this.form.get('nombre')?.value,
      descuentoMax: this.form.get('descuento')?.value,
      descripcion:  this.form.get('descripcion')?.value,
      isPerecedero: this.form.get('perecedero')?.value,
      estado:       true,
    }

    
    this.productoService.save(producto, this.img).subscribe({
      next: producto => {
        this.dialogRef.close(producto);
      },
      error: err => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error al registrar el producto: ' + err.error.message,
          showConfirmButton: false,
          timer: 2800
        })
      }
    })
    
  }

  invalidField(campo: string) {
    return this.form.get(campo)?.invalid && this.form.get(campo)?.touched;
  }

  onFileSelected() {
    const inputNode: any = document.querySelector('#file');
  
    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
        this.srcResult = e.target.result;
      };
  
      reader.readAsArrayBuffer(inputNode.files[0]);

      let imgnew: File = inputNode.files[0];

      if(imgnew.type == "image/jpeg" || imgnew.type == "image/jpg" || imgnew.type == "image/png"  ) {
        this.img = inputNode.files[0];
      } else {
        this.img = undefined;
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Imagen no valida, solo se admiten los formatos jpg, jpeg y png',
          showConfirmButton: false,
          timer: 2800
        })
      }

      
      
    }
  }

}
