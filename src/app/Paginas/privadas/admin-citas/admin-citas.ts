// ==========================================================
// IMPORTACIONES
// ==========================================================

// Component permite crear el componente.
// OnInit ejecuta código al abrir la página.
// ChangeDetectorRef permite actualizar la vista
// después de recibir datos del backend.
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

// Permite usar *ngIf y *ngFor.
import { CommonModule } from '@angular/common';

// Herramientas para formularios reactivos.
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

// Router permite volver al dashboard ADMIN.
import { Router } from '@angular/router';

// forkJoin permite cargar varias peticiones
// al mismo tiempo.
import { forkJoin } from 'rxjs';


// ==========================================================
// SERVICIOS
// ==========================================================

import { CitaServicio }
  from '../../../Servicios/cita-servicio';

import { MascotaServicio }
  from '../../../Servicios/mascota-servicio';

import { VeterinarioServicio }
  from '../../../Servicios/veterinario-servicio';

import { ServicioServicio }
  from '../../../Servicios/servicio-servicio';


@Component({

  selector: 'app-admin-citas',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './admin-citas.html',

  styleUrl: './admin-citas.scss'

})
export class AdminCitas implements OnInit {


  // ==========================================================
  // LISTAS
  // ==========================================================

  citas: any[] = [];

  mascotas: any[] = [];

  veterinarios: any[] = [];

  servicios: any[] = [];


  // ==========================================================
  // VARIABLES DE CONTROL
  // ==========================================================

  cargando: boolean = false;

  mensajeError: string = '';

  mensajeExito: string = '';

  mostrarFormulario: boolean = false;


  // null = creando
  // número = editando
  citaEditandoId: number | null = null;


  // ==========================================================
  // FORMULARIO
  // ==========================================================

  citaForm: FormGroup;


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(

    private citaServicio: CitaServicio,

    private mascotaServicio: MascotaServicio,

    private veterinarioServicio: VeterinarioServicio,

    private servicioServicio: ServicioServicio,

    private fb: FormBuilder,

    private router: Router,

    private cd: ChangeDetectorRef

  ) {


    // Los campos coinciden con Cita.java.
    this.citaForm = this.fb.group({

      fechaHora: [
        '',
        Validators.required
      ],

      motivo: [
        '',
        Validators.required
      ],

      mascotaId: [
        '',
        Validators.required
      ],

      veterinarioId: [
        '',
        Validators.required
      ],

      servicioId: [
        '',
        Validators.required
      ],

      estado: [
        'PENDIENTE',
        Validators.required
      ]

    });

  }


  // ==========================================================
  // AL ABRIR LA PÁGINA
  // ==========================================================

  ngOnInit(): void {

    this.cargarDatos();

  }


  // ==========================================================
  // CARGAR DATOS
  // ==========================================================
  //
  // Cargamos al mismo tiempo:
  //
  // - Todas las citas
  // - Todas las mascotas
  // - Veterinarios
  // - Servicios
  //
  // ==========================================================

  cargarDatos(): void {

    this.cargando = true;

    this.mensajeError = '';


    forkJoin({

      citas:
        this.citaServicio
          .listarTodasCitas(),

      mascotas:
        this.mascotaServicio
          .listarTodasMascotas(),

      veterinarios:
        this.veterinarioServicio
          .listarVeterinarios(),

      servicios:
        this.servicioServicio
          .listarServicios()

    })
    .subscribe({


      next: (respuesta) => {

        this.citas =
          respuesta.citas;

        this.mascotas =
          respuesta.mascotas;

        this.veterinarios =
          respuesta.veterinarios;

        this.servicios =
          respuesta.servicios;


        this.cargando = false;


        console.log(
          'Datos de administración de citas:',
          respuesta
        );


        this.cd.detectChanges();

      },


      error: (error) => {

        console.error(
          'Error al cargar datos:',
          error
        );


        this.mensajeError =
          'No se pudieron cargar los datos de las citas.';


        this.cargando = false;


        this.cd.detectChanges();

      }

    });

  }


  // ==========================================================
  // NUEVA CITA
  // ==========================================================

  nuevaCita(): void {

    this.citaEditandoId = null;


    this.citaForm.reset({

      fechaHora: '',

      motivo: '',

      mascotaId: '',

      veterinarioId: '',

      servicioId: '',

      estado: 'PENDIENTE'

    });


    this.mensajeError = '';

    this.mensajeExito = '';

    this.mostrarFormulario = true;

  }


  // ==========================================================
  // EDITAR CITA
  // ==========================================================

  editarCita(
    cita: any
  ): void {


    this.citaEditandoId =
      cita.id;


    this.citaForm.patchValue({

      fechaHora:
        this.formatearFechaParaInput(
          cita.fechaHora
        ),

      motivo:
        cita.motivo,

      mascotaId:
        cita.mascota?.id,

      veterinarioId:
        cita.veterinario?.id,

      servicioId:
        cita.servicio?.id,

      estado:
        cita.estado

    });


    this.mensajeError = '';

    this.mensajeExito = '';

    this.mostrarFormulario = true;

  }


  // ==========================================================
  // GUARDAR CITA
  // ==========================================================
  //
  // Sirve tanto para:
  //
  // POST → crear
  // PUT  → actualizar
  //
  // ==========================================================

  guardarCita(): void {


    if (this.citaForm.invalid) {

      this.citaForm.markAllAsTouched();

      return;

    }


    // Construimos exactamente el JSON
    // que espera CitaController.
    const datosCita = {

      fechaHora:
        this.citaForm.value.fechaHora,

      motivo:
        this.citaForm.value.motivo,

      estado:
        this.citaForm.value.estado,

      mascota: {

        id:
          Number(
            this.citaForm.value.mascotaId
          )

      },

      veterinario: {

        id:
          Number(
            this.citaForm.value.veterinarioId
          )

      },

      servicio: {

        id:
          Number(
            this.citaForm.value.servicioId
          )

      }

    };


    console.log(
      'Datos enviados:',
      datosCita
    );


    // ========================================================
    // ACTUALIZAR
    // ========================================================

    if (
      this.citaEditandoId !== null
    ) {


      this.citaServicio
        .actualizarCita(
          this.citaEditandoId,
          datosCita
        )
        .subscribe({


          next: (respuesta) => {

            console.log(
              'Cita actualizada:',
              respuesta
            );


            this.mensajeExito =
              'Cita actualizada correctamente.';


            this.cerrarFormulario();


            this.cargarDatos();

          },


          error: (error) => {

            console.error(
              'Error completo al actualizar:',
              error
            );


            this.mensajeError =
              error?.error?.message ||
              error?.error?.mensaje ||
              error?.error?.detail ||
              'No se pudo actualizar la cita.';


            this.cd.detectChanges();

          }

        });


      return;

    }


    // ========================================================
    // CREAR
    // ========================================================

    this.citaServicio
      .crearCita(
        datosCita
      )
      .subscribe({


        next: (respuesta) => {

          console.log(
            'Cita creada:',
            respuesta
          );


          this.mensajeExito =
            'Cita creada correctamente.';


          this.cerrarFormulario();


          this.cargarDatos();

        },


        error: (error) => {

          console.error(
            'Error completo al crear cita:',
            error
          );


          this.mensajeError =
            error?.error?.message ||
            error?.error?.mensaje ||
            error?.error?.detail ||
            'No se pudo crear la cita.';


          this.cd.detectChanges();

        }

      });

  }


  // ==========================================================
  // CANCELAR CITA
  // ==========================================================
  //
  // No elimina la cita.
  //
  // Cambia el estado a CANCELADA.
  // ==========================================================

  cancelarCita(
    cita: any
  ): void {


    const confirmar =
      window.confirm(
        `¿Estás seguro de cancelar la cita #${cita.id}?`
      );


    if (!confirmar) {

      return;

    }


    this.citaServicio
      .cancelarCita(
        cita.id
      )
      .subscribe({


        next: () => {

          this.mensajeExito =
            'Cita cancelada correctamente.';


          this.cargarDatos();

        },


        error: (error) => {

          console.error(
            'Error al cancelar cita:',
            error
          );


          this.mensajeError =
            error?.error?.message ||
            error?.error?.mensaje ||
            'No se pudo cancelar la cita.';


          this.cd.detectChanges();

        }

      });

  }


  // ==========================================================
  // ELIMINAR CITA
  // ==========================================================
  //
  // Elimina definitivamente la cita.
  //
  // Solo ADMIN.
  // ==========================================================

  eliminarCita(
    cita: any
  ): void {


    const confirmar =
      window.confirm(
        `¿Eliminar definitivamente la cita #${cita.id}?`
      );


    if (!confirmar) {

      return;

    }


    this.citaServicio
      .eliminarCita(
        cita.id
      )
      .subscribe({


        next: () => {

          this.mensajeExito =
            'Cita eliminada correctamente.';


          this.cargarDatos();

        },


        error: (error) => {

          console.error(
            'Error al eliminar cita:',
            error
          );


          this.mensajeError =
            error?.error?.message ||
            error?.error?.mensaje ||
            'No se pudo eliminar la cita.';


          this.cd.detectChanges();

        }

      });

  }


  // ==========================================================
  // FORMATEAR FECHA
  // ==========================================================
  //
  // datetime-local necesita:
  //
  // 2026-10-06T15:30
  //
  // El backend puede devolver:
  //
  // 2026-10-06T15:30:00
  //
  // Por eso conservamos únicamente
  // los primeros 16 caracteres.
  // ==========================================================

  formatearFechaParaInput(
    fechaHora: string
  ): string {


    if (!fechaHora) {

      return '';

    }


    return fechaHora.substring(
      0,
      16
    );

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
  // VOLVER AL DASHBOARD
  // ==========================================================

  volverDashboard(): void {

    this.router.navigate([
      '/admin/dashboard'
    ]);

  }

}