export interface Caja {
  id?:            number;
  nombre:        string;
  saldo:         number;
  saldoInic:     number;
  saldoFinal?:    number;
  saldoIngr?:     number;
  estado:        boolean;
  fechaApertura?: Date;
  fechaCierre?:   Date;
  aprobacion:    string;
  usuario:       Usuario;
  isIngreso?:       boolean;
}

export interface Usuario {
  id:       number;
  nombre:   string;
  apellido: string;
  username: string;
  password?: string;
  estado?:   boolean;
  roles?:    Role[];
}

export interface Role {
  id:     number;
  nombre: string;
}
