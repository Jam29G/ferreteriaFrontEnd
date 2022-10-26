import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Producto } from '../interfaces/producto.interface';
import { Empresa } from '../../empresas/interfaces/empresa.interface';
import { Ubicacion } from '../interfaces/ubicacion.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private base_url = `${environment.base_url}/api`;
  private token: string = this.authService.auth!.token;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getAll(estado: boolean): Observable<Producto[]> {
    const url = `${this.base_url}/productos?estado=${estado}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.get<Producto[]>(url, {headers});
  }

  getById(id: number): Observable<Producto> {
    const url = `${this.base_url}/productos/${id}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.get<Producto>(url, {headers});
  }

  save(producto: Producto, img?: File): Observable<Producto> {
    const url = `${this.base_url}/productos`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    const formData = new FormData();

    let json = new Blob([JSON.stringify(producto)], {type: "application/json"})
    formData.append("producto", json );

    if(img != undefined && img != null) {
      formData.append("img", img, img.name);
    }

    return this.http.post<Producto>(url, formData, {headers});

  }

  update(producto: Producto, id: number, img?: File): Observable<Producto> {

    const url = `${this.base_url}/productos/${id}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    const formData = new FormData();

    let json = new Blob([JSON.stringify(producto)], {type: "application/json"})
    formData.append("producto", json );

    if(img != undefined && img != null) {
      formData.append("img", img, img.name);
    }

    return this.http.put<Producto>(url, formData, {headers});

  }



  findProductos(filter: string, estado: boolean) {
    const url = `${this.base_url}/productos/find?filter=${filter}&estado=${estado}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.get<Producto[]>(url, {headers});
  }

  addEmpresas(id: number, empresas: Empresa[]): Observable<Producto> {
    const url = `${this.base_url}/productos/addEmpresas/${id}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.put<Producto>(url, empresas, {headers});
  }

  removeEmpresas(id: number, empresas: Empresa[]): Observable<Producto> {
    const url = `${this.base_url}/productos/removeEmpresa/${id}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.put<Producto>(url, empresas, {headers});
  }

  addUbicaciones(id: number, ubicaciones: Ubicacion[]): Observable<Producto> {
    const url = `${this.base_url}/productos/addUbicaciones/${id}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.put<Producto>(url, ubicaciones, {headers});
  }

  removeUbicaciones(id: number, ubicaciones: Ubicacion[]): Observable<Producto> {
    const url = `${this.base_url}/productos/removeUbicaciones/${id}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.put<Producto>(url, ubicaciones, {headers});
  }


}
