// ==========================================================
// IMPORTACIONES
// ==========================================================

// Component permite crear el componente.
// OnInit ejecuta código automáticamente al abrir la página.
// ChangeDetectorRef permite actualizar la vista cuando
// recibimos información desde Spring Boot.
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

// CommonModule permite utilizar *ngIf y *ngFor.
import { CommonModule } from '@angular/common';

// Herramientas para trabajar con formularios reactivos.
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

// Router permite navegar entre páginas.
import { Router } from '@angular/router';

// forkJoin permite ejecutar varias peticiones
// al backend al mismo tiempo.
import { forkJoin } from 'rxjs';


// ==========================================================
// SERVICIOS
// ==========================================================

// Servicio para gestionar citas.
import { CitaServicio }
  from '../../../Servicios/cita-servicio';

// Servicio para obtener las mascotas del USER.
import { MascotaServicio }
  from '../../../Servicios/mascota-servicio';

// Servicio para consultar los servicios de la veterinaria.
import { ServicioServicio }
  from '../../../Servicios/servicio-servicio';

// Servicio para consultar veterinarios.
import { VeterinarioServicio }
  from '../../../Servicios/veterinario-servicio';



@Component({

  // Nombre interno del componente.
  selector: 'app-citas',

  // Componente standalone.
  standalone: true,

  // Módulos necesarios para el HTML.
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  // Archivo HTML.
  templateUrl: './citas.html',

  // Archivo SCSS.
  styleUrl: './citas.scss'

})
export class Citas implements OnInit {


  // ==========================================================
  // LISTAS
  // ==========================================================

  // Citas pertenecientes al usuario autenticado.
  citas: any[] = [];

  // Mascotas pertenecientes al usuario.
  mascotas: any[] = [];

  // Servicios disponibles en la veterinaria.
  servicios: any[] = [];

  // Veterinarios disponibles.
  veterinarios: any[] = [];



  // ==========================================================
  // VARIABLES DE ESTADO
  // ==========================================================

  // Indica si estamos cargando información.
  cargando: boolean = false;

  // Mensaje utilizado cuando ocurre un error.
  mensajeError: string = '';

  // Mensaje utilizado cuando una operación funciona.
  mensajeExito: string = '';

  // Controla si se muestra el formulario.
  mostrarFormulario: boolean = false;

  // Si contiene un ID estamos editando una cita.
  // Si es null estamos registrando una cita nueva.
  citaEditandoId: number | null = null;



  // ==========================================================
  // FORMULARIO
  // ==========================================================

  citaForm: FormGroup;



  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(

    // Servicio de citas.
    private citaServicio: CitaServicio,

    // Servicio de mascotas.
    private mascotaServicio: MascotaServicio,

    // Servicio del catálogo de servicios.
    private servicioServicio: ServicioServicio,

    // Servicio de veterinarios.
    private veterinarioServicio: VeterinarioServicio,

    // Permite construir el formulario.
    private fb: FormBuilder,

    // Permite navegar entre páginas.
    private router: Router,

    // Permite actualizar manualmente la vista.
    private cd: ChangeDetectorRef

  ) {


    // ========================================================
    // CREACIÓN DEL FORMULARIO
    // ========================================================

    this.citaForm = this.fb.group({

      // Mascota seleccionada.
      mascotaId: [
        '',
        Validators.required
      ],

      // Servicio seleccionado.
      servicioId: [
        '',
        Validators.required
      ],

      // Veterinario seleccionado.
      veterinarioId: [
        '',
        Validators.required
      ],

      // Fecha y hora de la cita.
      fechaHora: [
        '',
        Validators.required
      ],

      // Motivo de la cita.
      motivo: [
        '',
        Validators.required
      ]

    });

  }



  // ==========================================================
  // AL ABRIR LA PÁGINA
  // ==========================================================

  ngOnInit(): void {

    // Cargamos toda la información necesaria
    // cuando el usuario entra a Mis Citas.
    this.cargarDatos();

  }



  // ==========================================================
  // CARGAR INFORMACIÓN
  // ==========================================================
  //
  // Aquí cargamos al mismo tiempo:
  //
  // - Mis citas
  // - Mis mascotas
  // - Servicios
  // - Veterinarios
  //
  // ==========================================================

  cargarDatos(): void {

    this.cargando = true;

    this.mensajeError = '';


    // forkJoin permite ejecutar varias consultas HTTP
    // y esperar a que todas terminen.
    forkJoin({

      citas:
        this.citaServicio.listarMisCitas(),

      mascotas:
        this.mascotaServicio.listarMisMascotas(),

      servicios:
        this.servicioServicio.listarServicios(),

      veterinarios:
        this.veterinarioServicio.listarVeterinarios()

    }).subscribe({


      // ======================================================
      // RESPUESTA CORRECTA
      // ======================================================

      next: (respuesta) => {

        // Guardamos los datos recibidos.
        this.citas = respuesta.citas;

        this.mascotas = respuesta.mascotas;

        this.servicios = respuesta.servicios;

        this.veterinarios = respuesta.veterinarios;


        // Terminamos el estado de carga.
        this.cargando = false;


        console.log(
          'Citas:',
          this.citas
        );

        console.log(
          'Mascotas:',
          this.mascotas
        );

        console.log(
          'Servicios:',
          this.servicios
        );

        console.log(
          'Veterinarios:',
          this.veterinarios
        );


        // Actualizamos la pantalla.
        this.cd.detectChanges();

      },


      // ======================================================
      // ERROR
      // ======================================================

      error: (error) => {

        console.error(
          'Error al cargar datos de citas:',
          error
        );


        this.mensajeError =
          'No se pudo cargar la información de las citas.';


        this.cargando = false;


        this.cd.detectChanges();

      }

    });

  }



  // ==========================================================
  // NUEVA CITA
  // ==========================================================

  nuevaCita(): void {

    // Indicamos que estamos creando,
    // no editando.
    this.citaEditandoId = null;

    // Limpiamos el formulario.
    this.citaForm.reset();

    // Limpiamos mensajes anteriores.
    this.mensajeError = '';
    this.mensajeExito = '';

    // Mostramos el formulario.
    this.mostrarFormulario = true;

  }



  // ==========================================================
  // EDITAR CITA
  // ==========================================================

  editarCita(cita: any): void {

    // Guardamos el ID de la cita.
    this.citaEditandoId = cita.id;


    // Cargamos los datos actuales dentro del formulario.
    this.citaForm.patchValue({

      mascotaId:
        cita.mascota?.id,

      servicioId:
        cita.servicio?.id,

      veterinarioId:
        cita.veterinario?.id,

      // datetime-local necesita:
      // YYYY-MM-DDTHH:mm
      fechaHora:
        this.formatearFechaParaInput(
          cita.fechaHora
        ),

      motivo:
        cita.motivo

    });


    // Limpiamos mensajes.
    this.mensajeError = '';
    this.mensajeExito = '';

    // Mostramos el formulario.
    this.mostrarFormulario = true;

  }



  // ==========================================================
  // GUARDAR CITA
  // ==========================================================
  //
  // Este mismo método sirve para:
  //
  // NUEVA CITA → POST
  // EDITAR     → PUT
  //
  // ==========================================================

  guardarCita(): void {


    // Si falta algún campo obligatorio,
    // no continuamos.
    if (this.citaForm.invalid) {

      this.citaForm.markAllAsTouched();

      return;

    }


    // ========================================================
    // CREAR EL JSON QUE NECESITA SPRING BOOT
    // ========================================================

    const datosCita = {

      fechaHora:
        this.citaForm.value.fechaHora,

      motivo:
        this.citaForm.value.motivo,

      mascota: {

        id:
          this.citaForm.value.mascotaId

      },

      veterinario: {

        id:
          this.citaForm.value.veterinarioId

      },

      servicio: {

        id:
          this.citaForm.value.servicioId

      }

    };


    // ========================================================
    // EDITAR CITA
    // ========================================================

    if (this.citaEditandoId !== null) {


      this.citaServicio
        .actualizarCita(
          this.citaEditandoId,
          datosCita
        )
        .subscribe({


          next: () => {

            this.mensajeExito =
              'Cita actualizada correctamente.';


            // Cerramos el formulario.
            this.cerrarFormulario();


            // Volvemos a cargar la información.
            this.cargarDatos();

          },


          error: (error) => {

            console.error(
              'Error al actualizar cita:',
              error
            );


            this.mensajeError =
              'No se pudo actualizar la cita.';


            this.cd.detectChanges();

          }

        });


      return;

    }



    // ========================================================
    // CREAR NUEVA CITA
    // ========================================================

    this.citaServicio
      .crearCita(datosCita)
      .subscribe({


        next: () => {

          this.mensajeExito =
            'Cita agendada correctamente.';


          // Cerramos el formulario.
          this.cerrarFormulario();


          // Recargamos las citas.
          this.cargarDatos();

        },


        error: (error) => {

          console.error(
            'Error al crear cita:',
            error
          );


          this.mensajeError =
            'No se pudo agendar la cita.';


          this.cd.detectChanges();

        }

      });

  }



  // ==========================================================
  // CANCELAR CITA
  // ==========================================================

  cancelarCita(cita: any): void {


    // Pedimos confirmación antes de cancelar.
    const confirmar = window.confirm(
      '¿Estás seguro de que deseas cancelar esta cita?'
    );


    // Si el usuario selecciona Cancelar,
    // no hacemos nada.
    if (!confirmar) {

      return;

    }


    // Ejecutamos:
    //
    // PUT /api/citas/{id}/cancelar
    this.citaServicio
      .cancelarCita(cita.id)
      .subscribe({


        next: () => {

          this.mensajeExito =
            'Cita cancelada correctamente.';


          // Recargamos las citas para mostrar
          // el nuevo estado CANCELADA.
          this.cargarDatos();

        },


        error: (error) => {

          console.error(
            'Error al cancelar cita:',
            error
          );


          this.mensajeError =
            'No se pudo cancelar la cita.';


          this.cd.detectChanges();

        }

      });

  }



  // ==========================================================
  // CERRAR FORMULARIO
  // ==========================================================

  cerrarFormulario(): void {

    this.mostrarFormulario = false;

    this.citaEditandoId = null;

    this.citaForm.reset();

    this.cd.detectChanges();

  }



  // ==========================================================
  // FORMATEAR FECHA
  // ==========================================================
  // Spring Boot puede devolver:
  //
  // 2026-10-20T10:30:00
  //
  // Pero input datetime-local utiliza:
  //
  // 2026-10-20T10:30
  // ==========================================================

  formatearFechaParaInput(
    fecha: string
  ): string {


    if (!fecha) {

      return '';

    }


    return fecha.substring(
      0,
      16
    );

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