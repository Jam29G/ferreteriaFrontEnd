import { Component, OnInit } from '@angular/core';

interface menuChildren {
  label: string,
  icon: string,
  link: string,
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
          label: "recurso 1",
          icon: "label",
          link: "/cajas/adm"
        },
        {
          label: "recurso 2",
          icon: "label",
          link: ""
        }
      ]
      
    },

  ]
    

  constructor() { }

  ngOnInit(): void {
  }

  

  desplegar(id: string, idIcon: string) {
    const element = document.getElementById(id);

    element?.classList.toggle("submenu-open");
    element?.classList.toggle("submenu-close");

    document.getElementById(idIcon)?.classList.toggle("downIcon");
  }
  

}
