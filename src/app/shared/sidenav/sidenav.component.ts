import { Component, OnInit } from '@angular/core';
import { Role } from 'src/app/usuarios/interface/usuario.interface';
import { UsuariosService } from '../../usuarios/services/usuarios.service';
import { AuthService } from '../../auth/services/auth.service';

interface menuChildren {
  label: string,
  icon: string,
  link: string,
}

interface UsuarioLogin {
  nombre:   string;
  apellido: string;
  rolstr?:   string;
}

interface menu {
  label: string,
  icon: string,
  link: string,
  id: string,
  children?: menuChildren[]
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  usuario: UsuarioLogin | undefined;

  menuItems: menu[] = [
    {
      label: "Inicio",
      icon: "home",
      link: "",
      id: "inicio"
    },
    {
      label: "Usuarios",
      icon: "person",
      link: "",
      id: "usuarios",
      children: [
        {
          label: "Administrar usuarios",
          icon: "label",
          link: "/usuarios/adm"
        },
      ]
      
    },
    {
      label: "Cajas",
      icon: "payment",
      link: "",
      id: "cajas",
      children: [
        {
          label: "Aprobacion de cajas",
          icon: "label",
          link: "/cajas/aprobaciones"
        },
        {
          label: "Gestionar caja",
          icon: "label",
          link: "/cajas/gestion"
        },
        {
          label: "Registros de caja",
          icon: "label",
          link: "/cajas/registros"
        },
      ]
    }

  ]
    

  constructor(
    private usuarioService: UsuariosService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.usuarioService.getById(this.authService.auth?.id!).subscribe({
      next: usuario => {
        this.usuario = {
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          rolstr: this.roleConverter(usuario.roles)
        }
      }
    })
  }

  

  desplegar(id: string, idIcon: string) {
    const element = document.getElementById(id);

    element?.classList.toggle("submenu-open");
    element?.classList.toggle("submenu-close");

    document.getElementById(idIcon)?.classList.toggle("downIcon");
  }

  roleConverter(roles: Role[]): string {

    if(roles.findIndex( rol => rol.nombre === "ROLE_ADMIN" ) != -1) {
      return "Administrador"
    } else if(roles.findIndex( rol => rol.nombre === "ROLE_GERENTE") != -1) {
      return "Gerente"
    } else {
      return "Cajero"
    }

  }
  

}
