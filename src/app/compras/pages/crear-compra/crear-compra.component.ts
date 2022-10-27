import { Component, OnInit, ViewChild } from '@angular/core';
import { EmpresaService } from '../../../empresas/services/empresa.service';
import { Empresa } from '../../../empresas/interfaces/empresa.interface';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ValidatorService } from '../../../shared/validator/validator.service';
import { Producto } from 'src/app/productos/interfaces/producto.interface';
import { MatTableDataSource } from '@angular/material/table';
import { DetalleProducto } from '../../../productos/interfaces/detalleProducto.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DetallesService } from '../../../productos/services/detalles.service';

@Component({
  selector: 'app-crear-compra',
  templateUrl: './crear-compra.component.html',
  styleUrls: ['./crear-compra.component.css']
})
export class CrearCompraComponent implements OnInit {

  //Datatable
  detallesProd: DetalleProducto[] = [];

  displayedColumns: string[] = ['codigo', 'nombre' , 'precioVenta', 'cantidad', 'perecedero','fechaVenc' , 'options'];
  dataSource!: MatTableDataSource<DetalleProducto>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  get facturaError(): string {

    const control = this.form.get('numFactura');

    if(control?.hasError('required')) {
      return "la factura es requerida";
    }

    if(control?.hasError('pattern')) {
      return "La factura solo puede tener letras y numeros";
    }
    return "";
  }

  //filtro
  myControl = new FormControl<string>('');
  empresas: Empresa[] = []; 
  empresa: Empresa | undefined;

  form: FormGroup = this.fb.group({
    numFactura: ['', [ Validators.required, Validators.pattern(this.vs.lowerLettersAndNumbers) ] ],
    
  });

  constructor(
    private empresaService: EmpresaService,
    private detalleService: DetallesService,
    private vs: ValidatorService,
    private fb: FormBuilder,
  ) { }


  ngOnInit(): void {

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
        console.log(this.empresa);
      },
      error: err => {

      }
    })
  }

  invalidField(campo: string) {
    return this.form.get(campo)?.invalid && this.form.get(campo)?.touched;
  }


  

}
