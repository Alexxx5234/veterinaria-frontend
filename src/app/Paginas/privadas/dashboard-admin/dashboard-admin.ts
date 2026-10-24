// ==========================================================
// IMPORTACIONES
// ==========================================================

// Component permite crear el componente.
import { Component } from '@angular/core';

// Router permite navegar entre las páginas del ADMIN.
import { Router } from '@angular/router';

// Servicio de autenticación.
// Lo utilizaremos para cerrar sesión.
import { AuthServicio }
  from '../../../Servicios/auth-servicio';


@Component({

  // Nombre interno del componente.
  selector: 'app-dashboard-admin',

  // Componente standalone.
  standalone: true,

  // Por ahora no necesitamos módulos adicionales.
  imports: [],

  // Archivo HTML.
  templateUrl: './dashboard-admin.html',

  // Archivo SCSS.
  styleUrl: './dashboard-admin.scss'

})
export class DashboardAdmin {


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(

    // Router permite navegar hacia
    // las distintas páginas administrativas.
    private router: Router,

    // Servicio encargado de la sesión.
    private authServicio: AuthServicio

  ) {}


  // ==========================================================
  // USUARIOS
  // ==========================================================

  irUsuarios(): void {

    this.router.navigate([
      '/admin/usuarios'
    ]);

  }


  // ==========================================================
  // MASCOTAS
  // ==========================================================

  irMascotas(): void {

    this.router.navigate([
      '/admin/mascotas'
    ]);

  }


  // ==========================================================
  // CITAS
  // ==========================================================

  irCitas(): void {

    this.router.navigate([
      '/admin/citas'
    ]);

  }


  // ==========================================================
  // SERVICIOS
  // ==========================================================

  irServicios(): void {

    this.router.navigate([
      '/admin/servicios'
    ]);

  }


  // ==========================================================
  // VETERINARIOS
  // ==========================================================

  irVeterinarios(): void {

    this.router.navigate([
      '/admin/veterinarios'
    ]);

  }


  // ==========================================================
  // CERRAR SESIÓN
  // ==========================================================

  cerrarSesion(): void {

    // Eliminamos token y rol guardados.
    this.authServicio.cerrarSesion();

    // Regresamos al login.
    this.router.navigate([
      '/login'
    ]);

  }

}