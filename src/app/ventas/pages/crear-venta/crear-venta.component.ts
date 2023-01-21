import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DetalleProducto } from 'src/app/productos/interfaces/detalleProducto.interface';
import { ValidatorService } from 'src/app/shared/validator/validator.service';
import { AddToVentaComponent } from '../../components/add-to-venta/add-to-venta.component';
import { CajasService } from '../../../cajas/services/cajas.service';
import Swal from 'sweetalert2';
import { Caja } from 'src/app/cajas/interfaces/caja.interface';
import { Router } from '@angular/router';
import { DetalleVenta, Venta } from '../../interfaces/Venta.interface';
import { VentasService } from '../../services/ventas.service';

@Component({
  selector: 'app-crear-venta',
  templateUrl: './crear-venta.component.html',
  styleUrls: ['./crear-venta.component.css']
})
export class CrearVentaComponent implements OnInit {

  get cantidadesGroup() {
    return this.form.get("cantidades") as FormGroup;
  }

  get descuentosGroup() {
    return this.form.get("descuentos") as FormGroup;
  }

  _caja: Caja | undefined;

  credFiscal: Boolean = false;

  //Datatable
  detallesProd: DetalleProducto[] = [];

  displayedColumns: string[] = ['codigo', 'nombre' , 'precioVenta', 'cantidad', 'aplicDesc' ,'importe', 'descuento' , 'options'];
  dataSource!: MatTableDataSource<DetalleProducto>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  form: FormGroup = this.fb.group({
    numFactura: ['', [ Validators.required, Validators.pattern(this.vs.lowerLettersAndNumbers) ] ],
    cliente: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60), Validators.pattern(this.vs.fullNamePattern) ]],
    pago: ['0', [Validators.required,  Validators.min(0.01) ]],
    direccion: ['', [ Validators.minLength(6), Validators.maxLength(180) ] ],
    departamento: ['', [Validators.minLength(6), Validators.maxLength(80), Validators.pattern(this.vs.onlyLetters)] ],
    numRegistro: ['', [Validators.required]],
    giro: ['', [Validators.minLength(3), Validators.maxLength(60), Validators.pattern(this.vs.onlyLetters)] ],
    cantidades: this.fb.group({
      
    }),
    descuentos: this.fb.group({
      
    })
    
  });

  monto: number = 0;
  pago: number = 0;

  constructor(
    private vs: ValidatorService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private authService: AuthService,
    private cajaService: CajasService,
    private route: Router,
    private ventaService: VentasService
  ) { }

  ngOnInit(): void {

    this.cajaService.getCajaUsuario(this.authService.auth?.id!).subscribe({
      next: caja => {
        this._caja = caja
      },
      error: err => {

        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Necesita abrir una caja para realizar una venta',
          showConfirmButton: false,
          timer: 2500
        })

        this.route.navigate(["./cajas/gestion"]);
      }
    })


    this.dataSource = new MatTableDataSource(this.detallesProd);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data: DetalleProducto, filter: string) => {

      if(data.producto.codigo.toLocaleLowerCase().includes(filter) || data.producto.nombre.toLocaleLowerCase().includes(filter) ) {
        return true;
      }

      return false;
    };
  }

  changeCantidad(index: number, id: number) {

    let cantidad: number | null = this.cantidadesGroup.get(id.toString())?.value;

    if(cantidad != null && cantidad > 0) {
      this.detallesProd[index].cantidadVP = cantidad;
      this.detallesProd[index].importe = this.detallesProd[index].precioVenta * cantidad;
      this.calculateTotal();
    } else {
      this.detallesProd[index].importe = 0;
      this.calculateTotal();
    }
  
  }

  changeDescuento(index: number, id: number) {

    if(this.descuentosGroup.get("desc" + id)?.invalid) return;

    let descuento: number = this.descuentosGroup.get("desc" + id)?.value;

    this.detallesProd[index].descuento = descuento / 100;

    this.calculateTotal();
  
  }

  changePago() {
    let value = this.form.get('pago')?.value;

    this.pago = value;
  }


  create() {
    const dialogRef = this.dialog.open(AddToVentaComponent, {
      panelClass: 'dialog-responsive-xl',
      data: this.detallesProd
    });

    dialogRef.afterClosed().subscribe({
      next: response => {

        if(response !== undefined) {
           
          let detalles: DetalleProducto[] = response;

          detalles.forEach(el => {
            el.cantidadVP = 0;
            el.importe = 0;
            el.descuento = 0;
            this.detallesProd.push(el);
            
            this.cantidadesGroup.addControl(el.id!.toString(), new FormControl('', [Validators.required, Validators.max(el.cantidad!), Validators.min(1) ]) )

            this.descuentosGroup.addControl( "desc" + el.id!, new FormControl('0', [Validators.required, Validators.max(el.producto.descuentoMax * 100)]) )

          })

          this.calculateTotal();


          this.dataSource.data = this.detallesProd;

        }

      }
    })
  }

  calculateTotal() {
    this.monto = 0;

    this.detallesProd.forEach(el => {
      this.monto += (el.importe! - (el.importe! * el.descuento!));
    })
  }


  submitForm() {

    this.sendVenta();

  }

  sendVenta() {
    
    this.form.markAllAsTouched();

    if(this.form.invalid) {
      return
    }

    

    if(this.monto > this.pago) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'El pago debe ser mayor o igual al monto total de la venta',
        showConfirmButton: false,
        timer: 2800
      })
    }

    let detallesVenta: DetalleVenta[] = [];

    this.detallesProd.forEach(producto => {

      let detalleVenta: DetalleVenta = {
   
        precioCompra:    producto.precioCompra,
        precioVenta:     producto.precioVenta,
        cantidad:        producto.cantidadVP!,
        descuento:       producto.descuento!,
        observaciones:   producto.descuento! > 0 ? "se realizo descuento" : "",
        detalleProducto: producto
      }

      detallesVenta.push(detalleVenta);
      
    })

    let venta: Venta = {
      cliente: this.form.get('cliente')?.value,
      numFactura: this.form.get('numFactura')?.value,
      isCredFisc: false,
      montoFinal: this.monto,
      pago: this.pago,
      cambio: this.pago - this.monto,
      usuario: {id: this.authService.auth?.id!},
      caja: {id: this._caja?.id!},
      detalleVentas: detallesVenta
      
    };

    if(this.credFiscal) {
      venta.direccion = this.form.get('direccion')?.value;
      venta.departamento = this.form.get('departamento')?.value;
      venta.numRegistro = this.form.get('numRegistro')?.value;
      venta.giro = this.form.get('giro')?.value;
      venta.isCredFisc = true;

    }

    this.ventaService.create(venta).subscribe({
      next: venta => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `Venta registrada con exito`,
          showConfirmButton: false,
          timer: 1500
        })
        this.dataSource.data = [];
        this.form.reset();
      },
      error: err => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: `Error al registrar la venta: ${err.error.message}` ,
          showConfirmButton: false,
          timer: 2500
        })
      }
    })

  }

  invalidField(campo: string) {
    return this.form.get(campo)?.invalid && this.form.get(campo)?.touched;
  }

  deleteElement(index: number, id: number) {
    this.detallesProd.splice(index, 1);
    this.cantidadesGroup.removeControl(id.toString());
    this.calculateTotal();
    this.dataSource.data = this.detallesProd;
  }

  changeCredito(event: MatCheckboxChange) {
    this.credFiscal = event.checked;
    
    if(!this.credFiscal) {
      this.form.get("direccion")?.clearValidators();
      this.form.get("direccion")?.updateValueAndValidity();

      this.form.get("departamento")?.clearValidators();
      this.form.get("departamento")?.updateValueAndValidity();

      this.form.get("numRegistro")?.clearValidators();
      this.form.get("numRegistro")?.updateValueAndValidity();

      this.form.get("giro")?.clearValidators();
      this.form.get("giro")?.updateValueAndValidity();

    } else {
      this.form.get("direccion")?.addValidators([Validators.required, Validators.minLength(6), Validators.maxLength(180) ]);
      this.form.get("direccion")?.updateValueAndValidity();

      this.form.get("departamento")?.addValidators([Validators.required, Validators.minLength(6), Validators.maxLength(80), Validators.pattern(this.vs.onlyLetters)]);
      this.form.get("departamento")?.updateValueAndValidity();

      this.form.get("numRegistro")?.addValidators([Validators.required]);
      this.form.get("numRegistro")?.updateValueAndValidity();

      this.form.get("giro")?.addValidators([Validators.required, Validators.minLength(3), Validators.maxLength(60), Validators.pattern(this.vs.onlyLetters)]);
      this.form.get("giro")?.updateValueAndValidity();
 
    }

    //console.log(this.form.valid);

  }



  //getter
  get facturaError() {

    const control = this.form.get('numFactura');
    if(control?.hasError('required')) {
      return "el numero de comprobante es requerido";
    }

    if(control?.hasError('pattern')) {
      return "el numero de combrobante solo puede tener letras y numeros";
    }

    return ""
  }

  get pagoError() {

    const control = this.form.get('pago');
    if(control?.hasError('required')) {
      return "el pago es requerido";
    }

    if(control?.hasError('min')) {
      return "La cantidad minima es 0.01";
    }

    return ""
  }

  //getter
  get clienteError() {
    const control = this.form.get('cliente');
    if(control?.hasError('required')) {
      return "El cliente es requerido";
    }

    if(control?.hasError('pattern')) {
      return "El cliente solo puede tener letras y caracteres permitidos";
    }

    if(control?.hasError('minlength')) return "El cliente debe tener un minimo de 3 caracteres";

    if(control?.hasError('maxlength')) return "El maximo de caracteres es 60";

    return "";
  }

  //getter
  get direccionError() {
    const control = this.form.get('direccion');

    if(control?.hasError('required')) {
      return "La direccion es requerida";
    }

    if(control?.hasError('minlength')) return "La direccion debe tener un minimo de 6 caracteres";

    if(control?.hasError('maxlength')) return "El maximo de caracteres es 180";
    return "";
  }

  //getter
  get departamentoError() {
    const control = this.form.get('departamento');

    if(control?.hasError('required')) {
      return "El departamento es requerido";
    }

    if(control?.hasError('minlength')) return "El departamento debe tener un minimo de 6 caracteres";

    if(control?.hasError('pattern')) {
      return "El departamento solo puede tener letras";
    }

    if(control?.hasError('maxlength')) return "El maximo de caracteres es 80";
    return "";
  }

  get numRegistroError() {
    const control = this.form.get('numRegistro');
    if(control?.hasError('required')) {
      return "El numero de registro es requerido";
    }

    if(control?.hasError('minlength')) return "El minimo de caracteres es 14";
    if(control?.hasError('maxlength')) return "El maximo de caracteres es 14";
    if(control?.hasError('pattern')) {
      return "Solo se permiten numeros y guiones";
    }

    return "";
  }

  get giroError() {
    const control = this.form.get('giro');
    if(control?.hasError('required')) {
      return "El giro es requerido";
    }

    if(control?.hasError('minlength')) return "El minimo de caracteres es 3";
    if(control?.hasError('maxlength')) return "El maximo de caracteres es 60";
    if(control?.hasError('pattern')) {
      return "Solo se permiten letras y espacios";
    }
    return "";
  }

}
