import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { Ubicacion } from '../interfaces/ubicacion.interface';
@Injectable({
  providedIn: 'root'
})
export class UbicacionService {

  private base_url = `${environment.base_url}/api`;
  private token: string = this.authService.auth!.token;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getAll() {
    const url = `${this.base_url}/ubicaciones`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.get<Ubicacion[]>(url, {headers});
  }

  save(ubicacion: Ubicacion) {
    const url = `${this.base_url}/ubicaciones`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.post<Ubicacion>(url, ubicacion, {headers})
  }

  delete(id: number): Observable<any> {
    const url = `${this.base_url}/ubicaciones/${id}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.delete<Ubicacion>(url, {headers})
  }

}
