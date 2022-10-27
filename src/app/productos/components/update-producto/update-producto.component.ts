import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidatorService } from 'src/app/shared/validator/validator.service';
import Swal from 'sweetalert2';
import { Producto } from '../../interfaces/producto.interface';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-update-producto',
  templateUrl: './update-producto.component.html',
  styleUrls: ['./update-producto.component.css']
})
export class UpdateProductoComponent implements OnInit {
  
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

  srcResult: any;

  img: File | undefined;

  imageBase: string = "http://localhost:8080/api/productos/image";

  form: FormGroup = this.fb.group({
    descuento: [(this.data.descuentoMax * 100), [ Validators.required, Validators.max(1) ] ],
    descripcion: [this.data.descripcion, [Validators.required, Validators.maxLength(244)] ],
  });
  
  constructor(
    private fb: FormBuilder,
    private vs: ValidatorService,
    private dialogRef: MatDialogRef<UpdateProductoComponent>,
    private productoService: ProductoService,
    @Inject(MAT_DIALOG_DATA) public data: Producto,
  ) { }
  
  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

  submitForm() { 
    this.form.markAllAsTouched();

    if(this.form.invalid) return

    let producto: Producto = this.data;

    producto.descuentoMax = this.form.get('descuento')?.value;
    producto.descripcion = this.form.get('descripcion')?.value;



    this.productoService.update(producto, producto.id!, this.img).subscribe({
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
    });

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
