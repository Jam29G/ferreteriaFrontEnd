export interface Producto {
  id?:           number;
  codigo:       string;
  nombre:       string;
  descuentoMax: number;
  descripcion:  string;
  isPerecedero: string;
  estado:       boolean;
  img?:          string;
  proveedores?:  Proveedor[];
  ubicaciones?:  Ubicacion[];
}

export interface Proveedor {
  id:        number;
  nombre:    string;
  direccion: string;
  telefono:  string;
  correo?:    string;
  estado:    boolean;
}

export interface Ubicacion {
  id:     number;
  zona:   string;
  numero: string;
  lugar:  string;
}
