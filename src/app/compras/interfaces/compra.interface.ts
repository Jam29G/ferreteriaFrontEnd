import { Role } from 'src/app/usuarios/interface/usuario.interface';
import { Empresa } from '../../empresas/interfaces/empresa.interface';
import { DetalleProducto } from '../../productos/interfaces/detalleProducto.interface';
export interface Compra {
  id?:            number;
  numFactura:    string;
  fechaCompra?:   Date;
  monto:         number;
  empresa:       Empresa;
  detalleCompra: DetalleCompra[];
  usuario: Usuario;
}

export interface DetalleCompra {
  id?:              number;
  precio:          number;
  cantidad:        number;
  detalleProducto: DetalleProducto;
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


