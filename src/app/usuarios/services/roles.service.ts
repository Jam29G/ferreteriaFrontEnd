import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Role } from '../interface/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private base_url = `${environment.base_url}/api`;
  private token: string = this.authService.auth!.token;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getAll(): Observable<Role[]> {
    const url = `${this.base_url}/usuarios/roles`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.get<Role[]>(url, {headers});

  }
  
}
