import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthRequiredGuard implements CanActivate, CanLoad {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean   {

    this.authService.verifySession();

    if(this.authService.auth === undefined) {

      this.router.navigate(['./auth/login']);
      return false
    }
      
    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {

    this.authService.verifySession();
    
    if(this.authService.auth === undefined) {

      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Necesita iniciar sesión para ingresar en la aplicacion',
        showConfirmButton: false,
        timer: 2000
      })

      this.router.navigate(['./auth/login']);
      return false
    }
      
    return true;


  }
}
