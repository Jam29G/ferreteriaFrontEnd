import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { Empresa } from '../interfaces/empresa.interface';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private base_url = `${environment.base_url}/api`;
  private token: string = this.authService.auth!.token;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getAll(estado: boolean): Observable<Empresa[]> {
    const url = `${this.base_url}/empresas?estado=${estado}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.get<Empresa[]>(url, {headers});
  }

  getById(id: number): Observable<Empresa> {
    const url = `${this.base_url}/empresas/${id}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.get<Empresa>(url, {headers});
  }

  findEmpresa(search: string, estado: boolean): Observable<Empresa[]> {
    const url = `${this.base_url}/empresas/find?search=${search}&estado=${estado}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.get<Empresa[]>(url, {headers});
  }

  create(empresa: Empresa): Observable<Empresa> {
    const url = `${this.base_url}/empresas`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.post<Empresa>(url, empresa, {headers})
  }

  update(empresa: Empresa, id: number): Observable<Empresa> {
    const url = `${this.base_url}/empresas/${id}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.put<Empresa>(url, empresa, {headers})
  }

  changeState(id: number, estado: boolean) {
    const url = `${this.base_url}/empresas/changeState/${id}?estado=${estado}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.put<Empresa>(url, undefined, {headers})

  }

}
