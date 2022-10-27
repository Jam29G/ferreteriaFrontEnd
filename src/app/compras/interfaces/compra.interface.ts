import { Empresa } from '../../empresas/interfaces/empresa.interface';
import { DetalleProducto } from '../../productos/interfaces/detalleProducto.interface';
export interface Compra {
  id?:            number;
  numFactura:    string;
  fechaCompra?:   Date;
  monto:         number;
  empresa:       Empresa;
  detalleCompra: DetalleCompra[];
}

export interface DetalleCompra {
  id?:              number;
  precio:          number;
  cantidad:        number;
  detalleProducto: DetalleProducto;
}


