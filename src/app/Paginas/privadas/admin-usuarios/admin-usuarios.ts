// ==========================================================
// IMPORTACIONES
// ==========================================================

// Component permite crear el componente.
// OnInit permite ejecutar código cuando se abre la página.
// ChangeDetectorRef nos ayuda a actualizar la vista
// después de recibir respuestas de Spring Boot.
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

// CommonModule permite utilizar *ngIf y *ngFor.
import { CommonModule } from '@angular/common';

// Router permite regresar al dashboard ADMIN.
import { Router } from '@angular/router';

// Servicio encargado de consumir los endpoints
// del AdminController de Spring Boot.
import { AdminUsuarioServicio }
  from '../../../Servicios/admin-usuario-servicio';


@Component({

  // Nombre interno del componente.
  selector: 'app-admin-usuarios',

  // Componente standalone.
  standalone: true,

  // CommonModule permite usar
  // *ngIf y *ngFor en el HTML.
  imports: [
    CommonModule
  ],

  // Archivo HTML.
  templateUrl: './admin-usuarios.html',

  // Archivo SCSS.
  styleUrl: './admin-usuarios.scss'

})
export class AdminUsuarios implements OnInit {


  // ==========================================================
  // LISTA DE USUARIOS
  // ==========================================================

  usuarios: any[] = [];


  // ==========================================================
  // VISTA ACTUAL
  // ==========================================================
  // Permite cambiar entre:
  //
  // - Todos los usuarios
  // - Usuarios pendientes
  // ==========================================================

  vistaActual:
    'todos' | 'pendientes' = 'todos';


  // ==========================================================
  // VARIABLES DE ESTADO
  // ==========================================================

  cargando: boolean = false;

  mensajeError: string = '';

  mensajeExito: string = '';


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(

    // Servicio que se comunica con AdminController.
    private adminUsuarioServicio: AdminUsuarioServicio,

    // Router para navegar.
    private router: Router,

    // Permite actualizar manualmente la pantalla.
    private cd: ChangeDetectorRef

  ) {}


  // ==========================================================
  // AL ABRIR LA PÁGINA
  // ==========================================================

  ngOnInit(): void {

    // Por defecto mostramos todos los usuarios.
    this.cargarUsuarios();

  }


  // ==========================================================
  // CARGAR TODOS LOS USUARIOS
  // ==========================================================

  cargarUsuarios(): void {

    this.vistaActual = 'todos';

    this.cargando = true;

    this.mensajeError = '';


    // GET /api/admin/usuarios
    this.adminUsuarioServicio
      .listarUsuarios()
      .subscribe({


        // RESPUESTA CORRECTA
        next: (respuesta) => {

          this.usuarios = respuesta;

          this.cargando = false;


          console.log(
            'Usuarios:',
            respuesta
          );


          this.cd.detectChanges();

        },


        // ERROR
        error: (error) => {

          console.error(
            'Error al cargar usuarios:',
            error
          );


          this.mensajeError =
            'No se pudieron cargar los usuarios.';


          this.cargando = false;


          this.cd.detectChanges();

        }

      });

  }


  // ==========================================================
  // CARGAR USUARIOS PENDIENTES
  // ==========================================================

  cargarPendientes(): void {

    this.vistaActual = 'pendientes';

    this.cargando = true;

    this.mensajeError = '';


    // GET /api/admin/usuarios-pendientes
    this.adminUsuarioServicio
      .listarPendientes()
      .subscribe({


        next: (respuesta) => {

          this.usuarios = respuesta;

          this.cargando = false;


          console.log(
            'Usuarios pendientes:',
            respuesta
          );


          this.cd.detectChanges();

        },


        error: (error) => {

          console.error(
            'Error al cargar pendientes:',
            error
          );


          this.mensajeError =
            'No se pudieron cargar los usuarios pendientes.';


          this.cargando = false;


          this.cd.detectChanges();

        }

      });

  }


  // ==========================================================
  // APROBAR USUARIO
  // ==========================================================

  aprobarUsuario(
    usuario: any
  ): void {


    const confirmar = window.confirm(
      `¿Deseas aprobar al usuario ${usuario.nombre}?`
    );


    if (!confirmar) {
      return;
    }


    // PUT /api/admin/aprobar/{id}
    this.adminUsuarioServicio
      .aprobarUsuario(usuario.id)
      .subscribe({


        next: () => {

          this.mensajeExito =
            'Usuario aprobado correctamente.';


          this.recargarVistaActual();

        },


        error: (error) => {

          console.error(
            'Error al aprobar usuario:',
            error
          );


          this.mensajeError =
            'No se pudo aprobar el usuario.';


          this.cd.detectChanges();

        }

      });

  }


  // ==========================================================
  // RECHAZAR USUARIO
  // ==========================================================

  rechazarUsuario(
    usuario: any
  ): void {


    const confirmar = window.confirm(
      `¿Deseas rechazar la solicitud de ${usuario.nombre}?`
    );


    if (!confirmar) {
      return;
    }


    // PUT /api/admin/rechazar/{id}
    this.adminUsuarioServicio
      .rechazarUsuario(usuario.id)
      .subscribe({


        next: () => {

          this.mensajeExito =
            'Usuario rechazado correctamente.';


          this.recargarVistaActual();

        },


        error: (error) => {

          console.error(
            'Error al rechazar usuario:',
            error
          );


          this.mensajeError =
            'No se pudo rechazar el usuario.';


          this.cd.detectChanges();

        }

      });

  }


  // ==========================================================
  // BLOQUEAR USUARIO
  // ==========================================================

  bloquearUsuario(
    usuario: any
  ): void {


    const confirmar = window.confirm(
      `¿Deseas bloquear la cuenta de ${usuario.nombre}?`
    );


    if (!confirmar) {
      return;
    }


    // PUT /api/admin/bloquear/{id}
    this.adminUsuarioServicio
      .bloquearUsuario(usuario.id)
      .subscribe({


        next: () => {

          this.mensajeExito =
            'Usuario bloqueado correctamente.';


          this.recargarVistaActual();

        },


        error: (error) => {

          console.error(
            'Error al bloquear usuario:',
            error
          );


          this.mensajeError =
            'No se pudo bloquear el usuario.';


          this.cd.detectChanges();

        }

      });

  }


  // ==========================================================
  // ACTIVAR USUARIO
  // ==========================================================

  activarUsuario(
    usuario: any
  ): void {


    const confirmar = window.confirm(
      `¿Deseas activar nuevamente la cuenta de ${usuario.nombre}?`
    );


    if (!confirmar) {
      return;
    }


    // PUT /api/admin/activar/{id}
    this.adminUsuarioServicio
      .activarUsuario(usuario.id)
      .subscribe({


        next: () => {

          this.mensajeExito =
            'Usuario activado correctamente.';


          this.recargarVistaActual();

        },


        error: (error) => {

          console.error(
            'Error al activar usuario:',
            error
          );


          this.mensajeError =
            'No se pudo activar el usuario.';


          this.cd.detectChanges();

        }

      });

  }


  // ==========================================================
  // ELIMINAR USUARIO
  // ==========================================================

  eliminarUsuario(
    usuario: any
  ): void {


    const confirmar = window.confirm(
      `¿Estás seguro de eliminar permanentemente a ${usuario.nombre}?`
    );


    if (!confirmar) {
      return;
    }


    // DELETE /api/admin/usuarios/{id}
    this.adminUsuarioServicio
      .eliminarUsuario(usuario.id)
      .subscribe({


        next: () => {

          this.mensajeExito =
            'Usuario eliminado correctamente.';


          this.recargarVistaActual();

        },


        error: (error) => {

          console.error(
            'Error al eliminar usuario:',
            error
          );


          this.mensajeError =
            'No se pudo eliminar el usuario.';


          this.cd.detectChanges();

        }

      });

  }


  // ==========================================================
  // RECARGAR LA VISTA ACTUAL
  // ==========================================================
  // Después de aprobar, bloquear, etc.,
  // actualizamos la lista que el ADMIN estaba observando.
  // ==========================================================

  recargarVistaActual(): void {

    if (this.vistaActual === 'pendientes') {

      this.cargarPendientes();

    } else {

      this.cargarUsuarios();

    }

  }


  // ==========================================================
  // COMPROBAR SI ES ADMIN
  // ==========================================================
  // Nos servirá en el HTML para evitar mostrar botones
  // administrativos peligrosos sobre otra cuenta ADMIN.
  // ==========================================================

  esAdmin(
    usuario: any
  ): boolean {

    return usuario.rol === 'ADMIN';

  }


  // ==========================================================
  // VOLVER AL DASHBOARD ADMIN
  // ==========================================================

  volverDashboard(): void {

    this.router.navigate([
      '/admin/dashboard'
    ]);

  }

}