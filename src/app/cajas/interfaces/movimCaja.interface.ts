import { Venta } from '../../ventas/interfaces/Venta.interface';
export interface MovimCaja {
  id:        number;
  motivo:    string;
  isIngreso: boolean;
  monto:     number;
  fecha:     Date;
  caja:      Caja;
  venta?:     Venta;
  tipo?:       string
}

export interface Caja {
  id:            number;
  nombre:        string;
  saldo:         number;
  saldoInic:     number;
  saldoFinal:    null;
  saldoIngr:     number;
  estado:        boolean;
  fechaApertura: Date;
  fechaCierre:   null;
  aprobacion:    string;
  usuario:       Usuario;
}

export interface Usuario {
  id:       number;
  nombre?:   string;
  apellido?: string;
  username: string;
  password?: string;
  estado?:   boolean;
  roles?:    Role[];
}

export interface Role {
  id:     number;
  nombre: string;
}
