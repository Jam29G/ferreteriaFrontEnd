import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Compra } from '../interfaces/compra.interface';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  private base_url = `${environment.base_url}/api`;
  private token: string = this.authService.auth!.token;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  create(compra: Compra): Observable<Compra> {
    const url = `${this.base_url}/compra`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.post<Compra>(url, compra, {headers});
  }
  
}
