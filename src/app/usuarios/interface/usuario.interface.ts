export interface Usuario {
  id?:       number;
  nombre:   string;
  apellido: string;
  username: string;
  password: string;
  estado:   boolean;
  roles:    Role[];
}

export interface Role {
  id:     number;
  nombre: string;
}
