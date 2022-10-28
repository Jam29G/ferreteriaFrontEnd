import { DetalleProducto } from "src/app/productos/interfaces/detalleProducto.interface";
import { Role } from "src/app/usuarios/interface/usuario.interface";

export interface Venta {
  id?:            number;
  cliente:       string;
  numFactura:    string;
  direccion?:     string;
  departamento?:  string;
  fecha?:         Date;
  numRegistro?:   string;
  giro?:          string;
  isCredFisc:    boolean;
  montoFinal:    number;
  cambio:        number;
  usuario:       Usuario;
  caja:          Caja;
  detalleVentas: DetalleVenta[];
}

export interface Caja {
  id:            number;
  nombre?:        string;
  saldo?:         number;
  saldoInic?:     number;
  saldoFinal?:    null;
  saldoIngr?:     number;
  estado?:        boolean;
  fechaApertura?: Date;
  fechaCierre?:   null;
  aprobacion?:    string;
  usuario?:       Usuario;
}

export interface Usuario {
  id:       number;
  nombre?:   string;
  apellido?: string;
  username?: string;
  password?: string;
  estado?:   boolean;
  roles?:    Role[];
}


export interface DetalleVenta {
  id?:              number;
  precioCompra:    number;
  precioVenta:     number;
  cantidad:        number;
  descuento:       number;
  observaciones:   null | string;
  detalleProducto: DetalleProducto;
}



