export interface Usuario {
  id?:       number;
  nombre:   string;
  apellido: string;
  username: string;
  password: string;
  estado:   boolean;
  roles:    Role[];
  rolstr?:   string;
}

export interface Role {
  id:     number;
  nombre: string;
}
