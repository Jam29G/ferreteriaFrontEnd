import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGerenteGuard implements CanActivate, CanLoad {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if(!this.authService.verifyRol("ROLE_GERENTE")) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Necesita permisos de gerente para acceder a este recurso',
        showConfirmButton: false,
        timer: 2000
      })

      this.router.navigate(['./']);
      return false
    }

    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {

    if(!this.authService.verifyRol("ROLE_GERENTE")) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Necesita permisos de gerente para acceder a este recurso',
        showConfirmButton: false,
        timer: 2000
      })

      this.router.navigate(['./']);
      return false
    }

    return true;
  }
}
