// ==========================================================
// IMPORTACIONES
// ==========================================================

// Injectable permite utilizar este servicio
// desde cualquier componente Angular.
import { Injectable } from '@angular/core';

// HttpClient permite realizar peticiones HTTP
// hacia nuestra API REST de Spring Boot.
import { HttpClient } from '@angular/common/http';

// Observable permite manejar las respuestas
// recibidas desde el backend.
import { Observable } from 'rxjs';


@Injectable({

  // El servicio estará disponible
  // para toda la aplicación.
  providedIn: 'root'

})
export class AuthServicio {


  // ==========================================================
  // URL BASE
  // ==========================================================

  private apiUrl =
    'http://localhost:8080/api/auth';


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private http: HttpClient
  ) {}


  // ==========================================================
  // REGISTRAR USUARIO
  // ==========================================================
  //
  // POST:
  // /api/auth/registro
  //
  // El backend recibe:
  //
  // {
  //   nombre,
  //   correo,
  //   password
  // }
  //
  // El backend automáticamente asigna:
  //
  // rol        = USER
  // estado     = PENDIENTE
  // verificado = false
  // activo     = true
  //
  // También genera un código de 4 dígitos
  // y lo envía al correo.
  // ==========================================================

  registrar(
    nombre: string,
    correo: string,
    password: string
  ): Observable<any> {


    const datosRegistro = {

      nombre: nombre,

      correo: correo,

      password: password

    };


    return this.http.post(
      `${this.apiUrl}/registro`,
      datosRegistro
    );

  }


  // ==========================================================
  // VERIFICAR CÓDIGO
  // ==========================================================
  //
  // POST:
  // /api/auth/verificar-codigo
  //
  // El backend recibe:
  //
  // {
  //   correo,
  //   codigo
  // }
  //
  // Si el código es correcto:
  //
  // verificado = true
  //
  // Después la cuenta todavía debe ser
  // aprobada por un ADMIN.
  // ==========================================================

  verificarCodigo(
    correo: string,
    codigo: string
  ): Observable<any> {


    const datosVerificacion = {

      correo: correo,

      codigo: codigo

    };


    return this.http.post(
      `${this.apiUrl}/verificar-codigo`,
      datosVerificacion
    );

  }


  // ==========================================================
  // LOGIN
  // ==========================================================
  //
  // POST:
  // /api/auth/login
  //
  // El backend recibe:
  //
  // {
  //   correo,
  //   password
  // }
  //
  // Y devuelve:
  //
  // {
  //   token,
  //   rol,
  //   mensaje
  // }
  // ==========================================================

  login(
    correo: string,
    password: string
  ): Observable<any> {


    const datosLogin = {

      correo: correo,

      password: password

    };


    return this.http.post(
      `${this.apiUrl}/login`,
      datosLogin
    );

  }


  // ==========================================================
  // GUARDAR SESIÓN
  // ==========================================================
  //
  // Guardamos el JWT y el rol en localStorage.
  // ==========================================================

  guardarSesion(
    token: string,
    rol: string
  ): void {


    localStorage.setItem(
      'token',
      token
    );


    localStorage.setItem(
      'rol',
      rol
    );

  }


  // ==========================================================
  // OBTENER TOKEN
  // ==========================================================

  obtenerToken(): string | null {

    return localStorage.getItem(
      'token'
    );

  }


  // ==========================================================
  // OBTENER ROL
  // ==========================================================

  obtenerRol(): string | null {

    return localStorage.getItem(
      'rol'
    );

  }


  // ==========================================================
  // COMPROBAR SI HAY SESIÓN
  // ==========================================================

  estaAutenticado(): boolean {

    return !!this.obtenerToken();

  }


  // ==========================================================
  // CERRAR SESIÓN
  // ==========================================================

  cerrarSesion(): void {

    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'rol'
    );

  }

}