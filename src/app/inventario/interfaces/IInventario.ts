export interface Inventario {
  id:              number;
  salida:          boolean;
  fechaMovimiento: Date;
  observacion:     string;
  precioCompra:    number;
  precioVenta:     number;
  monto:           number;
  cantidad:        number;
  producto:        Producto;
  usuario:         Usuario;
}

export interface Producto {
  id:           number;
  codigo:       string;
  nombre:       string;
  descuentoMax: number;
  descripcion:  string;
  estado:       boolean;
  isPerecedero: boolean;
  img:          string | null;
  proveedores:  Proveedore[];
  ubicaciones:  Ubicacione[];
}

export interface Proveedore {
  id:        number;
  nombre:    string;
  direccion: string;
  telefono:  string;
  correo:    string;
  estado:    boolean;
}

export interface Ubicacione {
  id:     number;
  zona:   string;
  numero: string;
  lugar:  string;
}

export interface Usuario {
  id:       number;
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
