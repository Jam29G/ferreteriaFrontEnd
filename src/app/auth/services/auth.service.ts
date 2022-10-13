import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpClientModule, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Auth } from '../interfaces/Auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private base_url = environment.base_url;

  private _auth: Auth | undefined;

  get auth(): Auth | undefined {
    return this._auth;
  }

  constructor(
    private http: HttpClient
  ) { }

  login(username: string, password: string): Observable<any> {

    let authUrl: string = `${this.base_url}/oauth/token`;

    const credenciales = btoa("angularapp" + ":" + "12345");

    const httpHeaders = new HttpHeaders( {
      "Content-Type":"application/x-www-form-urlencoded",
      "Authorization": "Basic " + credenciales
    });
    
    const body = new HttpParams()
    .set('username', username)
    .set('password', password)
    .set('grant_type', 'password');

    return this.http.post<any>(authUrl, body, {headers: httpHeaders})
    .pipe(
      tap(auth => {

        let payload = JSON.parse(window.atob(auth.access_token.split(".")[1]));

        this._auth = {
          token: auth.access_token,
          username: auth.username,
          id: auth.id,
          authorities: payload.authorities
        }

      })
    )

  }

  verifyRol(findRol: string) {

    if( this._auth?.authorities.findIndex( rol => rol === findRol ) == -1 ) {
      return false;
    } 

    return true;
  }

}
