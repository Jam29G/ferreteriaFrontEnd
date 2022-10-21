import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { Router } from '@angular/router';
import { Role, Usuario } from './usuarios/interface/usuario.interface';
import { UsuariosService } from './usuarios/services/usuarios.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'ferreteriaApp';

  constructor(
    public authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
 
  }


  logout() {
    this.authService.logout();
    this.router.navigate(['./auth/login'])
  }
}
