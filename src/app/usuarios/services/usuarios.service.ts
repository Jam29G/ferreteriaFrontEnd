import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Usuario } from '../interface/usuario.interface';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private base_url = `${environment.base_url}/api`;
  private token: string = this.authService.auth!.token;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  

  getAll(estado: boolean): Observable<Usuario[]> {
    const url = `${this.base_url}/usuarios?estado=${estado}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.get<Usuario[]>(url, {headers});

  }

  getById(id: number): Observable<Usuario> {
    const url = `${this.base_url}/usuarios/id/${id}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.get<Usuario>(url, {headers});
  }

  update(id: number, usuario: Usuario): Observable<Usuario> {
    const url = `${this.base_url}/usuarios/${id}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.put<Usuario>(url, usuario, {headers});
  }

  changeState(id: number, state: boolean): Observable<Usuario> {
    const url = `${this.base_url}/usuarios/changeState/${id}?state=${state}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.put<Usuario>(url, undefined, {headers});
  }

  save(usuario: Usuario): Observable<Usuario> {

    const url = `${this.base_url}/usuarios`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.post<Usuario>(url, usuario, {headers});

  }

  

}
