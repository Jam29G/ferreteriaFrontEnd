import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorService } from '../../../shared/validator/validator.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, AfterViewInit {

  get usernameError(): string {
    const control = this.form.get('username');

    if(control?.hasError('required')) {
      return "El username es requerido";
    }

    if(control?.hasError('minlength')) return "El username debe tener un minimo de 3 caracteres";

    if(control?.hasError('pattern')) {
      return "El username no puede tener caracteres especiales como: ? @ $ %";
    }

    return "";
  }

  get passwordError(): string {
    const control = this.form.get('password');

    if(control?.hasError('required')) {
      return "El password es requerido";
    }

    if(control?.hasError('minlength')) return "La contraseña debe tener un minimo de 3 caracteres";

    return "";
  }

  form: FormGroup = this.fb.group({
    username: ['', [ Validators.required, Validators.minLength(3), Validators.pattern(this.vs.usernamePattern) ] ],
    password: ['', [ Validators.required, Validators.minLength(3) ] ]
  })

  constructor(
    private elementRef: ElementRef,
    private fb: FormBuilder,
    private vs: ValidatorService,
    private authService: AuthService,
    private router: Router
  ) { }

  

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    
      this.elementRef.nativeElement.ownerDocument
          .body.style.backgroundImage = 'url("assets/img/loginbg.jpg")';
  }

  invalidField(campo: string) {
    return this.form.get(campo)?.invalid && this.form.get(campo)?.touched;
  }

  submitForm() {

    this.form.markAllAsTouched();

    if(this.form.invalid) return

    let username = this.form.get('username')?.value;
    let password = this.form.get('password')?.value;

    this.authService.login(username, password).subscribe({
      next: (auth) => {


        this.router.navigate(['./']);

      },
      error: (err) => {
        if(err.status == 400 || err.status == 401) {

          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Credenciales no validas',
            showConfirmButton: false,
            timer: 1500
          })

        } else {

          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error al conectar con el servidor',
            showConfirmButton: false,
            timer: 1500
          })

        }


      }
    })
    
    
    
  }


}
