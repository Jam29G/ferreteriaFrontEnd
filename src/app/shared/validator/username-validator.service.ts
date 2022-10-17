import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsernameValidatorService implements AsyncValidator {

  private base_url = `${environment.base_url}/api`;
  private token: string = this.authService.auth!.token;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  validate(control: AbstractControl<any, any>): Observable<ValidationErrors | null> {
    const username = control.value;
    const url = `${this.base_url}/usuarios/exist/${username}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.get<any>(url, {headers})
      .pipe(
        map(res => {
          return res ? {usernameTomado: true} : null
        })
      )
  }
}
