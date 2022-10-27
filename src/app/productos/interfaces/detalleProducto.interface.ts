import { Producto } from "./producto.interface";
import { Ubicacion } from "./ubicacion.interface";


export interface DetalleProducto {
  id?:            number;
  precioCompra:  number;
  precioVenta:   number;
  cantidad?:      number;
  fechaVenc?:     Date;
  isVencido?:     boolean;
  is_perecedero: boolean;
  estado:        boolean;
  producto:      Producto;
  cantidadVP?: number;
}

