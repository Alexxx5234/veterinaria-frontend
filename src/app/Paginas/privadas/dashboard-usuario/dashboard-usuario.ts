// Component permite crear el componente.
import { Component } from '@angular/core';

// Router permite navegar entre las páginas.
import { Router } from '@angular/router';

// Servicio de autenticación.
import { AuthServicio } from '../../../Servicios/auth-servicio';


@Component({
  selector: 'app-dashboard-usuario',

  standalone: true,

  imports: [],

  templateUrl: './dashboard-usuario.html',

  styleUrl: './dashboard-usuario.scss'
})
export class DashboardUsuario {


  constructor(
    private router: Router,
    private authServicio: AuthServicio
  ) {}


  // Ir a la página de mascotas.
  irMascotas(): void {

    this.router.navigate([
      '/usuario/mascotas'
    ]);

  }


  // Ir a la página de citas.
  irCitas(): void {

    this.router.navigate([
      '/usuario/citas'
    ]);

  }


  // Ir a la página de servicios.
  irServicios(): void {

    this.router.navigate([
      '/usuario/servicios'
    ]);

  }


  // Ir a la página de veterinarios.
  irVeterinarios(): void {

    this.router.navigate([
      '/usuario/veterinarios'
    ]);

  }


  // Cerrar la sesión actual.
  cerrarSesion(): void {

    // Eliminamos token y rol.
    this.authServicio.cerrarSesion();

    // Regresamos al login.
    this.router.navigate([
      '/login'
    ]);

  }

}