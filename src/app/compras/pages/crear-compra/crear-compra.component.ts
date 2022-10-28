import { Component, OnInit, ViewChild } from '@angular/core';
import { EmpresaService } from '../../../empresas/services/empresa.service';
import { Empresa } from '../../../empresas/interfaces/empresa.interface';
import Swal from 'sweetalert2';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ValidatorService } from '../../../shared/validator/validator.service';
import { MatTableDataSource } from '@angular/material/table';
import { DetalleProducto } from '../../../productos/interfaces/detalleProducto.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DetallesService } from '../../../productos/services/detalles.service';
import { MatDialog } from '@angular/material/dialog';
import { AddItemComponent } from '../../components/add-item/add-item.component';
import { DetalleCompra, Compra } from '../../interfaces/compra.interface';
import { ComprasService } from '../../services/compras.service';
import { AuthService } from '../../../auth/services/auth.service';

interface dataDialog {
  empresa: Empresa;
  detallesProd: DetalleProducto[];
}

@Component({
  selector: 'app-crear-compra',
  templateUrl: './crear-compra.component.html',
  styleUrls: ['./crear-compra.component.css']
})
export class CrearCompraComponent implements OnInit {

  //Datatable
  detallesProd: DetalleProducto[] = [];

  displayedColumns: string[] = ['codigo', 'nombre' , 'precioCompra', 'cantidad', 'perecedero','fechaVenc', 'importe' , 'options'];
  dataSource!: MatTableDataSource<DetalleProducto>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  get facturaError(): string {

    const control = this.form.get('numFactura');

    if(control?.hasError('required')) {
      return "el numero de factura es requerida";
    }

    if(control?.hasError('pattern')) {
      return "el numero de factura solo puede tener letras y numeros";
    }
    return "";
  }

  get cantidadesGroup() {
    return this.form.get("cantidades") as FormGroup;
  }

  monto = 0;

  //filtro
  myControl = new FormControl<string>('');
  empresas: Empresa[] = []; 
  empresa: Empresa | undefined;

  form: FormGroup = this.fb.group({
    numFactura: ['', [ Validators.required, Validators.pattern(this.vs.lowerLettersAndNumbers) ] ],
    cantidades: this.fb.group({
      
    })
    
  });

  constructor(
    private empresaService: EmpresaService,
    private detalleService: DetallesService,
    private compraService: ComprasService,
    private vs: ValidatorService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private authService: AuthService
  ) { }


  ngOnInit(): void {


    this.dataSource = new MatTableDataSource(this.detallesProd);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data: DetalleProducto, filter: string) => {

      if(data.producto.codigo.toLocaleLowerCase().includes(filter) || data.producto.nombre.toLocaleLowerCase().includes(filter) ) {
        return true;
      }

      return false;
    };

    this.empresaService.getAll(true).subscribe({
      next: empresas => {
        this.empresas = empresas;
        
      },
      error: err => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al obtener las empresas: ' + err.error.message,
          showConfirmButton: false,
          timer: 1500
        })
      }
    })

  }

  //Filtro
  buscar() {
    this.empresaService.findEmpresa(this.myControl.value?.trim().toLocaleLowerCase()!, true).subscribe({
      next: empresas => {
        this.empresas = empresas;
      },
      error: err => {

      }
    })
  }

  displayFn(empresa: Empresa): string {
    return empresa && empresa.nombre && empresa.id ? empresa.id! + " - " + empresa.nombre : '';
  }

  opcionSeleccionada(event: MatAutocompleteSelectedEvent) {
    const empresa: Empresa = event.option.value;

    this.empresaService.getById(empresa.id!).subscribe({
      next: empresa => {
        this.empresa = empresa;

        this.detallesProd.forEach(el => {
          this.cantidadesGroup.removeControl(el.id!.toString());
        })

        this.detallesProd = [];
        this.monto = 0;
        this.dataSource.data = this.detallesProd;
      },
      error: err => {

      }
    })
  }

  invalidField(campo: string) {
    return this.form.get(campo)?.invalid && this.form.get(campo)?.touched;
  }

  create() {

    let datad: dataDialog = {
      empresa: this.empresa!,
      detallesProd: this.detallesProd
    }
    const dialogRef = this.dialog.open(AddItemComponent, {
      panelClass: 'dialog-responsive-xl',
      data: datad
    });

    dialogRef.afterClosed().subscribe({
      next: response => {

        if(response !== undefined) {
           
          let detalles: DetalleProducto[] = response;

          detalles.forEach(el => {
            el.cantidadVP = 0;
            el.importe = 0;
            this.detallesProd.push(el);
            this.cantidadesGroup.addControl(el.id!.toString(), new FormControl('', [Validators.required, Validators.min(1)]) )
          })

          this.calculateTotal();


          this.dataSource.data = this.detallesProd;

        }

      }
    })


    
  }

  changeCantidad(index: number, id: number) {

    let cantidad: number | null = this.cantidadesGroup.get(id.toString())?.value;

    if(cantidad != null && cantidad > 0) {
      this.detallesProd[index].cantidadVP = cantidad;
      this.detallesProd[index].importe = this.detallesProd[index].precioCompra * cantidad;
      this.calculateTotal();
    } else {
      this.detallesProd[index].importe = 0;
      this.calculateTotal();
    }
  
  }

  calculateTotal() {
    this.monto = 0;

    this.detallesProd.forEach(el => {
      this.monto += el.importe!;
    })
  }

  submitForm() {

    Swal.fire({
      title: `¿Ralizar compra?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Si`,
      denyButtonText: `Cancelar`,
    }).then((result) => {

      if (result.isConfirmed) {

        this.sendVenta();
 
      } else if (result.isDenied) {
        Swal.fire('Accion cancelada')
      }
    })

  }

  sendVenta() {
    this.form.markAllAsTouched();

    if(this.form.invalid) {
      return
    }

    let detallesCompra: DetalleCompra[] = [];

    this.detallesProd.forEach(el => {
      
      let detalleCompra: DetalleCompra = {
        precio:          el.precioCompra,
        cantidad:        el.cantidadVP!,
        detalleProducto: el
      }

      detallesCompra.push(detalleCompra);

    })

    let compra: Compra = {
      numFactura:    this.form.get("numFactura")?.value,
      monto:         this.monto,
      empresa:       this.empresa!,
      detalleCompra: detallesCompra,
      usuario: {id: this.authService.auth?.id!}
    }

    
    this.compraService.create(compra).subscribe({
      next: compra => {

        this.detallesProd.forEach(el => {
          this.cantidadesGroup.removeControl(el.id!.toString());
        })

        this.detallesProd = [];
        this.dataSource.data = this.detallesProd;
        this.monto = 0;
        this.form.reset();

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Compra registrada correctamente: ',
          showConfirmButton: false,
          timer: 2800
        })

      },
      error: err => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al obtener los productos: ' + err.error.message,
          showConfirmButton: false,
          timer: 2800
        })
      }
    })

  }

  deleteElement(index: number, id: number) {
    this.detallesProd.splice(index, 1);
    this.cantidadesGroup.removeControl(id.toString());
    this.calculateTotal();
    this.dataSource.data = this.detallesProd;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      
    }
  }


  

}
