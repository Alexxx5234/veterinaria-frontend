// ==========================================================
// IMPORTACIONES
// ==========================================================

// Component permite crear el componente.
// OnInit ejecuta código al abrir la página.
// ChangeDetectorRef permite actualizar manualmente la vista.
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

// CommonModule permite utilizar *ngIf y *ngFor.
import { CommonModule } from '@angular/common';

// Herramientas para crear el formulario de mascotas.
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

// Router permite navegar entre páginas.
import { Router } from '@angular/router';

// Servicio que se comunica con Spring Boot.
import { MascotaServicio }
  from '../../../Servicios/mascota-servicio';



@Component({

  selector: 'app-mascotas',

  standalone: true,

  // CommonModule:
  // permite *ngIf y *ngFor.
  //
  // ReactiveFormsModule:
  // permite utilizar formularios reactivos.
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './mascotas.html',

  styleUrl: './mascotas.scss'

})
export class Mascotas implements OnInit {


  // ==========================================================
  // LISTA DE MASCOTAS
  // ==========================================================

  mascotas: any[] = [];


  // ==========================================================
  // ESTADOS DE LA PÁGINA
  // ==========================================================

  // Indica si estamos consultando la API.
  cargando: boolean = false;

  // Mensaje de error.
  mensajeError: string = '';

  // Mensaje cuando una operación funciona.
  mensajeExito: string = '';



  // ==========================================================
  // FORMULARIO
  // ==========================================================

  mascotaForm: FormGroup;


  // Controla si mostramos u ocultamos el formulario.
  mostrarFormulario: boolean = false;


  // Si esta variable tiene un ID significa
  // que estamos EDITANDO una mascota.
  //
  // Si es null significa que estamos REGISTRANDO.
  mascotaEditandoId: number | null = null;



  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(

    private mascotaServicio: MascotaServicio,

    private router: Router,

    private fb: FormBuilder,

    private cd: ChangeDetectorRef

  ) {


    // Creamos el formulario.
    this.mascotaForm = this.fb.group({

      nombre: [
        '',
        Validators.required
      ],

      especie: [
        '',
        Validators.required
      ],

      raza: [
        '',
        Validators.required
      ],

      edad: [
        '',
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      sexo: [
        '',
        Validators.required
      ]

    });

  }



  // ==========================================================
  // AL ABRIR LA PÁGINA
  // ==========================================================

  ngOnInit(): void {

    this.cargarMascotas();

  }



  // ==========================================================
  // CARGAR LAS MASCOTAS DEL USER
  // ==========================================================

  cargarMascotas(): void {

    this.cargando = true;

    this.mensajeError = '';


    this.mascotaServicio
      .listarMisMascotas()
      .subscribe({


        // RESPUESTA CORRECTA
        next: (respuesta) => {

          this.mascotas = respuesta;

          this.cargando = false;

          console.log(
            'Mascotas del usuario:',
            respuesta
          );

          this.cd.detectChanges();

        },


        // ERROR
        error: (error) => {

          console.error(
            'Error al cargar mascotas:',
            error
          );

          this.mensajeError =
            'No se pudieron cargar las mascotas.';

          this.cargando = false;

          this.cd.detectChanges();

        }

      });

  }



  // ==========================================================
  // ABRIR FORMULARIO PARA REGISTRAR
  // ==========================================================

  nuevaMascota(): void {

    // Indicamos que NO estamos editando.
    this.mascotaEditandoId = null;

    // Limpiamos el formulario.
    this.mascotaForm.reset();

    // Limpiamos mensajes.
    this.mensajeError = '';
    this.mensajeExito = '';

    // Mostramos el formulario.
    this.mostrarFormulario = true;

  }



  // ==========================================================
  // ABRIR FORMULARIO PARA EDITAR
  // ==========================================================

  editarMascota(mascota: any): void {

    // Guardamos el ID de la mascota que editaremos.
    this.mascotaEditandoId = mascota.id;


    // Colocamos los datos actuales dentro del formulario.
    this.mascotaForm.patchValue({

      nombre: mascota.nombre,

      especie: mascota.especie,

      raza: mascota.raza,

      edad: mascota.edad,

      sexo: mascota.sexo

    });


    this.mensajeError = '';
    this.mensajeExito = '';

    // Mostramos el formulario.
    this.mostrarFormulario = true;

  }



  // ==========================================================
  // GUARDAR MASCOTA
  // ==========================================================
  // Este método sirve tanto para:
  //
  // REGISTRAR → POST
  // EDITAR    → PUT
  // ==========================================================

  guardarMascota(): void {


    // Si hay campos incorrectos, no continuamos.
    if (this.mascotaForm.invalid) {

      this.mascotaForm.markAllAsTouched();

      return;

    }


    // Obtenemos los datos del formulario.
    const datosMascota = this.mascotaForm.value;


    // ========================================================
    // EDITAR MASCOTA
    // ========================================================

    if (this.mascotaEditandoId !== null) {


      this.mascotaServicio
        .actualizarMascota(
          this.mascotaEditandoId,
          datosMascota
        )
        .subscribe({


          next: () => {

            this.mensajeExito =
              'Mascota actualizada correctamente.';

            this.cerrarFormulario();

            // Recargamos la lista.
            this.cargarMascotas();

          },


          error: (error) => {

            console.error(
              'Error al actualizar mascota:',
              error
            );

            this.mensajeError =
              'No se pudo actualizar la mascota.';

            this.cd.detectChanges();

          }

        });


      return;

    }



    // ========================================================
    // REGISTRAR NUEVA MASCOTA
    // ========================================================

    this.mascotaServicio
      .registrarMascota(datosMascota)
      .subscribe({


        next: () => {

          this.mensajeExito =
            'Mascota registrada correctamente.';

          this.cerrarFormulario();

          // Recargamos para mostrar la nueva mascota.
          this.cargarMascotas();

        },


        error: (error) => {

          console.error(
            'Error al registrar mascota:',
            error
          );

          this.mensajeError =
            'No se pudo registrar la mascota.';

          this.cd.detectChanges();

        }

      });

  }



  // ==========================================================
  // CERRAR FORMULARIO
  // ==========================================================

  cerrarFormulario(): void {

    this.mostrarFormulario = false;

    this.mascotaEditandoId = null;

    this.mascotaForm.reset();

    this.cd.detectChanges();

  }



  // ==========================================================
  // REGRESAR AL DASHBOARD
  // ==========================================================

  volverDashboard(): void {

    this.router.navigate([
      '/usuario/dashboard'
    ]);

  }

}