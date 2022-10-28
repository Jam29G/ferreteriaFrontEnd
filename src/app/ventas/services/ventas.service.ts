import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Venta } from '../interfaces/Venta.interface';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  private base_url = `${environment.base_url}/api`;
  private token: string = this.authService.auth!.token;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  create(venta: Venta): Observable<Venta> {
    const url = `${this.base_url}/venta`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.post<Venta>(url, venta, {headers});
  }
}
