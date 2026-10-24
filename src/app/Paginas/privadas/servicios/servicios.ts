// ==========================================================
// IMPORTACIONES
// ==========================================================

// Component permite crear el componente.
// OnInit permite ejecutar código cuando se abre la página.
// ChangeDetectorRef permite actualizar la vista
// después de recibir información del backend.
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

// CommonModule permite utilizar *ngIf y *ngFor.
import { CommonModule } from '@angular/common';

// Router permite navegar entre páginas.
import { Router } from '@angular/router';

// Servicio encargado de consultar
// los servicios de la veterinaria.
import { ServicioServicio }
  from '../../../Servicios/servicio-servicio';


@Component({

  // Nombre interno del componente.
  selector: 'app-servicios',

  // Componente standalone.
  standalone: true,

  // CommonModule permite utilizar
  // *ngIf y *ngFor en el HTML.
  imports: [
    CommonModule
  ],

  // Archivo HTML.
  templateUrl: './servicios.html',

  // Archivo SCSS.
  styleUrl: './servicios.scss'

})
export class Servicios implements OnInit {


  // ==========================================================
  // LISTA DE SERVICIOS
  // ==========================================================
  // Aquí guardaremos los servicios
  // que devuelve Spring Boot.

  servicios: any[] = [];


  // ==========================================================
  // VARIABLES DE ESTADO
  // ==========================================================

  // Indica si estamos consultando la API.
  cargando: boolean = false;

  // Mensaje que se mostrará si ocurre un error.
  mensajeError: string = '';



  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(

    // Servicio que se comunica con:
    // GET /api/servicios
    private servicioServicio: ServicioServicio,

    // Router para regresar al dashboard.
    private router: Router,

    // Permite actualizar manualmente
    // la información mostrada en pantalla.
    private cd: ChangeDetectorRef

  ) {}



  // ==========================================================
  // AL ABRIR LA PÁGINA
  // ==========================================================

  ngOnInit(): void {

    // Cargamos automáticamente
    // los servicios disponibles.
    this.cargarServicios();

  }



  // ==========================================================
  // CARGAR SERVICIOS
  // ==========================================================

  cargarServicios(): void {

    // Mostramos estado de carga.
    this.cargando = true;

    // Limpiamos errores anteriores.
    this.mensajeError = '';


    // Ejecutamos:
    //
    // GET /api/servicios
    //
    // El interceptor agrega automáticamente
    // el JWT del usuario.
    this.servicioServicio
      .listarServicios()
      .subscribe({


        // ====================================================
        // RESPUESTA CORRECTA
        // ====================================================

        next: (respuesta) => {

          // Guardamos los servicios.
          this.servicios = respuesta;

          // Finalizamos el estado de carga.
          this.cargando = false;


          console.log(
            'Servicios disponibles:',
            respuesta
          );


          // Actualizamos la pantalla.
          this.cd.detectChanges();

        },


        // ====================================================
        // ERROR
        // ====================================================

        error: (error) => {

          console.error(
            'Error al cargar servicios:',
            error
          );


          this.mensajeError =
            'No se pudieron cargar los servicios.';


          this.cargando = false;


          this.cd.detectChanges();

        }

      });

  }



  // ==========================================================
  // VOLVER AL DASHBOARD
  // ==========================================================

  volverDashboard(): void {

    this.router.navigate([
      '/usuario/dashboard'
    ]);

  }

}