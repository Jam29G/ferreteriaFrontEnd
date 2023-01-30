import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Inventario } from '../interfaces/IInventario';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private base_url = `${environment.base_url}/api`;
  private token: string = this.authService.auth!.token;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getRecordsToday(): Observable<Inventario[]> {
    const url = `${this.base_url}/controlInventario`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })
    return this.http.get<Inventario[]>(url, {headers});
  }

  getByRange(start: string, end: string): Observable<Inventario[]> {
    const url = `${this.base_url}/controlInventario/getByRange?fechaInicio=${start}&fechaFin=${end}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })
    return this.http.get<Inventario[]>(url, {headers});
  }

  getById(id: number): Observable<Inventario> {
    const url = `${this.base_url}/controlInventario/${id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })
    return this.http.get<Inventario>(url, {headers});
  }
}
