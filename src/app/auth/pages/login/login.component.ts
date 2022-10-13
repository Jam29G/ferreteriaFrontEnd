import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  get usernameError(): string {
    const control = this.form.get('username');

    if(control?.hasError('required')) {
      return "El nombre de usuario es requerido";
    }

    if(control?.hasError('minlength')) return "El nombre de usuario debe tener un minimo de 3 caracteres";

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
    username: ['', [ Validators.required, Validators.minLength(3) ] ],
    password: ['', [ Validators.required, Validators.minLength(3) ] ]
  })

  constructor(
    private elementRef: ElementRef,
    private fb: FormBuilder
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
    console.log(this.form.value);
    console.log(this.form.valid);
    console.log(this.form.get('username')?.errors)

    this.form.markAllAsTouched();
  }


}
