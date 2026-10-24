// ==========================================================
// IMPORTACIONES
// ==========================================================

// Component permite crear el componente.
// OnInit ejecuta código automáticamente al abrir la página.
// ChangeDetectorRef permite actualizar la vista
// después de recibir la respuesta del backend.
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
// los veterinarios desde Spring Boot.
import { VeterinarioServicio }
  from '../../../Servicios/veterinario-servicio';


@Component({

  // Nombre interno del componente.
  selector: 'app-veterinarios',

  // Componente standalone.
  standalone: true,

  // CommonModule permite usar
  // *ngIf y *ngFor en el HTML.
  imports: [
    CommonModule
  ],

  // Archivo HTML.
  templateUrl: './veterinarios.html',

  // Archivo SCSS.
  styleUrl: './veterinarios.scss'

})
export class Veterinarios implements OnInit {


  // ==========================================================
  // LISTA DE VETERINARIOS
  // ==========================================================

  // Aquí guardaremos los veterinarios
  // que devuelve Spring Boot.
  veterinarios: any[] = [];


  // ==========================================================
  // VARIABLES DE ESTADO
  // ==========================================================

  // Indica si estamos cargando información.
  cargando: boolean = false;

  // Mensaje mostrado cuando ocurre un error.
  mensajeError: string = '';


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(

    // Servicio que se comunica con:
    // GET /api/veterinarios
    private veterinarioServicio: VeterinarioServicio,

    // Router para regresar al dashboard.
    private router: Router,

    // Permite actualizar manualmente
    // la vista cuando llegan los datos.
    private cd: ChangeDetectorRef

  ) {}


  // ==========================================================
  // AL ABRIR LA PÁGINA
  // ==========================================================

  ngOnInit(): void {

    // Cargamos automáticamente
    // los veterinarios disponibles.
    this.cargarVeterinarios();

  }


  // ==========================================================
  // CARGAR VETERINARIOS
  // ==========================================================

  cargarVeterinarios(): void {

    // Activamos el estado de carga.
    this.cargando = true;

    // Limpiamos errores anteriores.
    this.mensajeError = '';


    // Ejecutamos:
    //
    // GET /api/veterinarios
    //
    // El interceptor agrega automáticamente
    // el token JWT.
    this.veterinarioServicio
      .listarVeterinarios()
      .subscribe({


        // ====================================================
        // RESPUESTA CORRECTA
        // ====================================================

        next: (respuesta) => {

          // Guardamos los veterinarios.
          this.veterinarios = respuesta;

          // Desactivamos el estado de carga.
          this.cargando = false;


          console.log(
            'Veterinarios disponibles:',
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
            'Error al cargar veterinarios:',
            error
          );


          this.mensajeError =
            'No se pudieron cargar los veterinarios.';


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