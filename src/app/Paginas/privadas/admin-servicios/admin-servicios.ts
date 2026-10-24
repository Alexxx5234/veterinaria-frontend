// ==========================================================
// IMPORTACIONES
// ==========================================================

// Component permite crear el componente.
// OnInit ejecuta código automáticamente al abrir la página.
// ChangeDetectorRef permite actualizar la vista
// después de recibir respuestas del backend.
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

// CommonModule permite utilizar *ngIf y *ngFor.
import { CommonModule } from '@angular/common';

// Herramientas necesarias para formularios reactivos.
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

// Router permite regresar al dashboard ADMIN.
import { Router } from '@angular/router';

// Servicio encargado de comunicarse
// con los endpoints de servicios.
import { ServicioServicio }
  from '../../../Servicios/servicio-servicio';


@Component({

  selector: 'app-admin-servicios',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './admin-servicios.html',

  styleUrl: './admin-servicios.scss'

})
export class AdminServicios implements OnInit {


  // ==========================================================
  // LISTA DE SERVICIOS
  // ==========================================================

  servicios: any[] = [];


  // ==========================================================
  // VARIABLES DE ESTADO
  // ==========================================================

  cargando: boolean = false;

  mensajeError: string = '';

  mensajeExito: string = '';

  mostrarFormulario: boolean = false;


  // Si tiene un ID estamos editando.
  // Si es null estamos creando.
  servicioEditandoId: number | null = null;


  // ==========================================================
  // FORMULARIO
  // ==========================================================

  servicioForm: FormGroup;


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(

    private servicioServicio: ServicioServicio,

    private fb: FormBuilder,

    private router: Router,

    private cd: ChangeDetectorRef

  ) {


    // Creamos el formulario.
    this.servicioForm = this.fb.group({

      // Nombre obligatorio.
      nombre: [
        '',
        Validators.required
      ],

      // Descripción obligatoria.
      descripcion: [
        '',
        Validators.required
      ],

      // Precio obligatorio y mayor que 0.
      precio: [
        '',
        [
          Validators.required,
          Validators.min(0.01)
        ]
      ]

    });

  }


  // ==========================================================
  // AL ABRIR LA PÁGINA
  // ==========================================================

  ngOnInit(): void {

    this.cargarServicios();

  }


  // ==========================================================
  // CARGAR SERVICIOS
  // ==========================================================

  cargarServicios(): void {

    this.cargando = true;

    this.mensajeError = '';


    // GET /api/servicios
    this.servicioServicio
      .listarServicios()
      .subscribe({


        next: (respuesta) => {

          this.servicios = respuesta;

          this.cargando = false;


          console.log(
            'Servicios:',
            respuesta
          );


          this.cd.detectChanges();

        },


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
  // NUEVO SERVICIO
  // ==========================================================

  nuevoServicio(): void {

    // Indicamos que estamos creando.
    this.servicioEditandoId = null;

    // Limpiamos el formulario.
    this.servicioForm.reset();

    // Limpiamos mensajes anteriores.
    this.mensajeError = '';
    this.mensajeExito = '';

    // Mostramos el formulario.
    this.mostrarFormulario = true;

  }


  // ==========================================================
  // EDITAR SERVICIO
  // ==========================================================

  editarServicio(
    servicio: any
  ): void {

    // Guardamos el ID del servicio.
    this.servicioEditandoId = servicio.id;


    // Cargamos los datos actuales.
    this.servicioForm.patchValue({

      nombre:
        servicio.nombre,

      descripcion:
        servicio.descripcion,

      precio:
        servicio.precio

    });


    this.mensajeError = '';
    this.mensajeExito = '';

    this.mostrarFormulario = true;

  }


  // ==========================================================
  // GUARDAR SERVICIO
  // ==========================================================
  //
  // Sirve tanto para:
  //
  // CREAR  → POST
  // EDITAR → PUT
  //
  // ==========================================================

  guardarServicio(): void {


    // Si hay errores de validación,
    // no enviamos la petición.
    if (this.servicioForm.invalid) {

      this.servicioForm.markAllAsTouched();

      return;

    }


    // Obtenemos los datos del formulario.
    const datosServicio =
      this.servicioForm.value;


    // ========================================================
    // EDITAR
    // ========================================================

    if (this.servicioEditandoId !== null) {


      this.servicioServicio
        .actualizarServicio(
          this.servicioEditandoId,
          datosServicio
        )
        .subscribe({


          next: () => {

            this.mensajeExito =
              'Servicio actualizado correctamente.';


            this.cerrarFormulario();


            // Actualizamos la lista.
            this.cargarServicios();

          },


          error: (error) => {

            console.error(
              'Error al actualizar servicio:',
              error
            );


            this.mensajeError =
              'No se pudo actualizar el servicio.';


            this.cd.detectChanges();

          }

        });


      return;

    }


    // ========================================================
    // CREAR
    // ========================================================

    this.servicioServicio
      .crearServicio(
        datosServicio
      )
      .subscribe({


        next: () => {

          this.mensajeExito =
            'Servicio creado correctamente.';


          this.cerrarFormulario();


          // Actualizamos la lista.
          this.cargarServicios();

        },


        error: (error) => {

          console.error(
            'Error al crear servicio:',
            error
          );


          this.mensajeError =
            'No se pudo crear el servicio.';


          this.cd.detectChanges();

        }

      });

  }


  // ==========================================================
  // ELIMINAR SERVICIO
  // ==========================================================

  eliminarServicio(
    servicio: any
  ): void {


    const confirmar = window.confirm(
      `¿Estás seguro de eliminar el servicio ${servicio.nombre}?`
    );


    if (!confirmar) {

      return;

    }


    // DELETE /api/servicios/{id}
    this.servicioServicio
      .eliminarServicio(
        servicio.id
      )
      .subscribe({


        next: () => {

          this.mensajeExito =
            'Servicio eliminado correctamente.';


          this.cargarServicios();

        },


        error: (error) => {

          console.error(
            'Error al eliminar servicio:',
            error
          );


          this.mensajeError =
            'No se pudo eliminar el servicio.';


          this.cd.detectChanges();

        }

      });

  }


  // ==========================================================
  // CERRAR FORMULARIO
  // ==========================================================

  cerrarFormulario(): void {

    this.mostrarFormulario = false;

    this.servicioEditandoId = null;

    this.servicioForm.reset();

    this.cd.detectChanges();

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