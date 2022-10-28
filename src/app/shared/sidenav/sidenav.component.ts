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
    },
    {
      label: "Productos",
      icon: "inventory2",
      link: "",
      id: "productos",
      children: [
        {
          label: "Administrar productos",
          icon: "label",
          link: "/productos/adm"
        },
        {
          label: "Administrar detalles de productos",
          icon: "label",
          link: "/productos/admDetalles"
        },
        {
          label: "Ubicaciones de productos",
          icon: "label",
          link: "/productos/ubicaciones"
        },
        {
          label: "Ver productos",
          icon: "label",
          link: "/productos/verProductos"
        },
        
      ]
    },
    {
      label: "Ventas",
      icon: "store_front",
      link: "",
      id: "ventas",
      children: [
        {
          label: "Crear venta",
          icon: "label",
          link: "/ventas/crear"
        },
      ]
    },
    {
      label: "Compras",
      icon: "shopping_cart_checkout",
      link: "",
      id: "compras",
      children: [
        {
          label: "Crear compra",
          icon: "label",
          link: "/compras/crear"
        },
        {
          label: "Ver compras",
          icon: "label",
          link: "/compras/verCompras"
        },
      ]
    },
    {
      label: "Empresas",
      icon: "domain",
      link: "/empresas/adm",
      id: "empresas"
    },
    

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
