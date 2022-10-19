import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { Caja } from '../interfaces/caja.interface';
import { Observable } from 'rxjs';
import { MovimCaja } from '../interfaces/movimCaja.interface';

@Injectable({
  providedIn: 'root'
})
export class CajasService {

  private base_url = `${environment.base_url}/api`;
  private token: string = this.authService.auth!.token;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getCajaUsuario(id: number): Observable<Caja> {
    const url = `${this.base_url}/cajas/usuario/${id}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.get<Caja>(url, {headers});
  }

  getMovimCaja(cajaId: number, isIngreso: boolean): Observable<MovimCaja[]> {
    const url = `${this.base_url}/cajas/movimientos?cajaId=${cajaId}&isIngreso=${isIngreso}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.get<MovimCaja[]>(url, {headers})
  }

  abrirCaja(caja: Caja): Observable<Caja> {

    const url = `${this.base_url}/cajas`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.post<Caja>(url, caja, {headers});
  }

  cerrarCaja(caja: Caja): Observable<Caja> {

    const url = `${this.base_url}/cajas/cerrar`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.put<Caja>(url, caja, {headers});
  }

  emitirGasto(caja: Caja, monto: number, motivo: string): Observable<any> {

    const url = `${this.base_url}/cajas/emitirGasto?monto=${monto}&motivo=${motivo}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.put<any>(url, caja, {headers});
  }

  abonarCaja(caja: Caja, monto: number, motivo: string): Observable<any> {

    const url = `${this.base_url}/cajas/abonarCaja?monto=${monto}&motivo=${motivo}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.put<any>(url, caja, {headers});
  }




}
