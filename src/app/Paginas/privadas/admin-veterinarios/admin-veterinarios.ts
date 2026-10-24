// ==========================================================
// IMPORTACIONES
// ==========================================================

import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { VeterinarioServicio }
  from '../../../Servicios/veterinario-servicio';


@Component({

  selector: 'app-admin-veterinarios',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './admin-veterinarios.html',

  styleUrl: './admin-veterinarios.scss'

})
export class AdminVeterinarios implements OnInit {


  // ==========================================================
  // LISTADO
  // ==========================================================

  veterinarios: any[] = [];


  // ==========================================================
  // VARIABLES DE CONTROL
  // ==========================================================

  cargando: boolean = false;

  mensajeError: string = '';

  mensajeExito: string = '';

  mostrarFormulario: boolean = false;

  veterinarioEditandoId: number | null = null;


  // ==========================================================
  // FORMULARIO
  // ==========================================================

  veterinarioForm: FormGroup;


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(

    private veterinarioServicio: VeterinarioServicio,

    private fb: FormBuilder,

    private router: Router,

    private cd: ChangeDetectorRef

  ) {


    // Los nombres de los campos deben coincidir
    // exactamente con Veterinario.java.
    this.veterinarioForm = this.fb.group({

      cedula: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10)
        ]
      ],

      nombre: [
        '',
        Validators.required
      ],

      apellido: [
        '',
        Validators.required
      ],

      especialidad: [
        '',
        Validators.required
      ],

      telefono: [
        '',
        Validators.required
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ]

    });

  }


  // ==========================================================
  // AL INICIAR
  // ==========================================================

  ngOnInit(): void {

    this.cargarVeterinarios();

  }


  // ==========================================================
  // LISTAR VETERINARIOS
  // ==========================================================

  cargarVeterinarios(): void {

    this.cargando = true;

    this.mensajeError = '';


    this.veterinarioServicio
      .listarVeterinarios()
      .subscribe({


        next: (respuesta) => {

          this.veterinarios = respuesta;

          this.cargando = false;


          console.log(
            'Veterinarios recibidos:',
            respuesta
          );


          this.cd.detectChanges();

        },


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
  // NUEVO VETERINARIO
  // ==========================================================

  nuevoVeterinario(): void {

    this.veterinarioEditandoId = null;

    this.veterinarioForm.reset();

    this.mensajeError = '';

    this.mensajeExito = '';

    this.mostrarFormulario = true;

  }


  // ==========================================================
  // EDITAR VETERINARIO
  // ==========================================================

  editarVeterinario(
    veterinario: any
  ): void {


    this.veterinarioEditandoId =
      veterinario.id;


    // Cargamos TODOS los campos que existen
    // en la entidad Veterinario.java.
    this.veterinarioForm.patchValue({

      cedula:
        veterinario.cedula,

      nombre:
        veterinario.nombre,

      apellido:
        veterinario.apellido,

      especialidad:
        veterinario.especialidad,

      telefono:
        veterinario.telefono,

      email:
        veterinario.email

    });


    this.mensajeError = '';

    this.mensajeExito = '';

    this.mostrarFormulario = true;

  }


  // ==========================================================
  // GUARDAR
  // ==========================================================

  guardarVeterinario(): void {


    if (this.veterinarioForm.invalid) {

      this.veterinarioForm.markAllAsTouched();

      return;

    }


    // Este JSON ahora coincide con Veterinario.java:
    //
    // {
    //   cedula,
    //   nombre,
    //   apellido,
    //   especialidad,
    //   telefono,
    //   email
    // }
    const datosVeterinario =
      this.veterinarioForm.value;


    console.log(
      'Datos enviados:',
      datosVeterinario
    );


    // ========================================================
    // ACTUALIZAR
    // ========================================================

    if (
      this.veterinarioEditandoId !== null
    ) {


      this.veterinarioServicio
        .actualizarVeterinario(
          this.veterinarioEditandoId,
          datosVeterinario
        )
        .subscribe({


          next: (respuesta) => {

            console.log(
              'Veterinario actualizado:',
              respuesta
            );


            this.mensajeExito =
              'Veterinario actualizado correctamente.';


            this.cerrarFormulario();


            this.cargarVeterinarios();

          },


          error: (error) => {

            console.error(
              'Error completo al actualizar:',
              error
            );


            this.mensajeError =
              error?.error?.message ||
              error?.error?.mensaje ||
              'No se pudo actualizar el veterinario.';


            this.cd.detectChanges();

          }

        });


      return;

    }


    // ========================================================
    // CREAR
    // ========================================================

    this.veterinarioServicio
      .crearVeterinario(
        datosVeterinario
      )
      .subscribe({


        next: (respuesta) => {

          console.log(
            'Veterinario creado:',
            respuesta
          );


          this.mensajeExito =
            'Veterinario creado correctamente.';


          this.cerrarFormulario();


          this.cargarVeterinarios();

        },


        error: (error) => {

          console.error(
            'Error completo al crear:',
            error
          );


          this.mensajeError =
            error?.error?.message ||
            error?.error?.mensaje ||
            'No se pudo crear el veterinario.';


          this.cd.detectChanges();

        }

      });

  }


  // ==========================================================
  // ELIMINAR
  // ==========================================================

  eliminarVeterinario(
    veterinario: any
  ): void {


    const confirmar =
      window.confirm(
        `¿Estás seguro de eliminar a ${veterinario.nombre} ${veterinario.apellido}?`
      );


    if (!confirmar) {

      return;

    }


    this.veterinarioServicio
      .eliminarVeterinario(
        veterinario.id
      )
      .subscribe({


        next: () => {

          this.mensajeExito =
            'Veterinario eliminado correctamente.';


          this.cargarVeterinarios();

        },


        error: (error) => {

          console.error(
            'Error al eliminar veterinario:',
            error
          );


          this.mensajeError =
            'No se pudo eliminar el veterinario. Puede tener citas asociadas.';


          this.cd.detectChanges();

        }

      });

  }


  // ==========================================================
  // CERRAR FORMULARIO
  // ==========================================================

  cerrarFormulario(): void {

    this.mostrarFormulario = false;

    this.veterinarioEditandoId = null;

    this.veterinarioForm.reset();

    this.cd.detectChanges();

  }


  // ==========================================================
  // VOLVER
  // ==========================================================

  volverDashboard(): void {

    this.router.navigate([
      '/admin/dashboard'
    ]);

  }

}