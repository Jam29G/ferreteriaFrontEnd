import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DetalleProducto } from '../interfaces/detalleProducto.interface';


@Injectable({
  providedIn: 'root'
})
export class DetallesService {

  private base_url = `${environment.base_url}/api`;
  private token: string = this.authService.auth!.token;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getAll(): Observable<DetalleProducto[]> {
    const url = `${this.base_url}/detalleProducto`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.get<DetalleProducto[]>(url, {headers});
  }

  getPerecederos(): Observable<DetalleProducto[]> {
    const url = `${this.base_url}/detalleProducto/find/caducados`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.get<DetalleProducto[]>(url, {headers});
  }



  getByFilter(filter: string): Observable<DetalleProducto[]> {
    const url = `${this.base_url}/detalleProducto/find/${filter}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.get<DetalleProducto[]>(url, {headers});
  }


  getByProductoId(id: number, estado: boolean): Observable<DetalleProducto[]> {
    const url = `${this.base_url}/detalleProducto/productos/${id}?estado=${estado}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.get<DetalleProducto[]>(url, {headers});
  }

  getByEmpresa(id: number, estado: boolean) {
    const url = `${this.base_url}/detalleProducto/empresa/${id}?estado=${estado}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.get<DetalleProducto[]>(url, {headers});
  }

  getById(id: number): Observable<DetalleProducto> {
    const url = `${this.base_url}/detalleProducto/${id}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.get<DetalleProducto>(url, {headers});
  }

  checkPerecederos(): Observable<boolean> {
    const url = `${this.base_url}/detalleProducto/checkPerecederos`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })
    return this.http.get<boolean>(url, {headers})
  }

  create(detalleProducto: DetalleProducto): Observable<DetalleProducto> {
    const url = `${this.base_url}/detalleProducto`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.post<DetalleProducto>(url, detalleProducto, {headers});
  }

  update(detalleProducto: DetalleProducto, id: number): Observable<DetalleProducto> {
    const url = `${this.base_url}/detalleProducto/${id}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.put<DetalleProducto>(url, detalleProducto, {headers});
  }

  updateCantidad(detalleProducto: DetalleProducto, id: number, usuarioId: number): Observable<DetalleProducto> {
    const url = `${this.base_url}/detalleProducto/updateCantidad/${id}/${usuarioId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })
    return this.http.put<DetalleProducto>(url, detalleProducto, {headers});
  }

  changeState(id: number, estado: boolean): Observable<any> {
    const url = `${this.base_url}/detalleProducto/changeState/${id}?estado=${estado}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.put<any>(url, undefined, {headers});
  }


}
