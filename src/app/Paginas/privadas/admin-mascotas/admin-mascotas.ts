// ==========================================================
// IMPORTACIONES
// ==========================================================

// Component permite crear el componente.
// OnInit permite ejecutar código al abrir la página.
// ChangeDetectorRef ayuda a actualizar la vista
// después de recibir respuestas del backend.
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

// Permite utilizar *ngIf y *ngFor.
import { CommonModule } from '@angular/common';

// Herramientas para trabajar con formularios reactivos.
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

// Router permite regresar al dashboard ADMIN.
import { Router } from '@angular/router';

// Servicio encargado de comunicarse
// con /api/mascotas.
import { MascotaServicio }
  from '../../../Servicios/mascota-servicio';


@Component({

  selector: 'app-admin-mascotas',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './admin-mascotas.html',

  styleUrl: './admin-mascotas.scss'

})
export class AdminMascotas implements OnInit {


  // ==========================================================
  // LISTA DE MASCOTAS
  // ==========================================================

  mascotas: any[] = [];


  // ==========================================================
  // VARIABLES DE CONTROL
  // ==========================================================

  cargando: boolean = false;

  mensajeError: string = '';

  mensajeExito: string = '';

  mostrarFormulario: boolean = false;


  // Guarda el ID de la mascota que estamos editando.
  mascotaEditandoId: number | null = null;


  // Guardamos temporalmente el usuario dueño
  // para conservarlo cuando hacemos el PUT.
  usuarioActual: any = null;


  // ==========================================================
  // FORMULARIO
  // ==========================================================

  mascotaForm: FormGroup;


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(

    private mascotaServicio: MascotaServicio,

    private fb: FormBuilder,

    private router: Router,

    private cd: ChangeDetectorRef

  ) {


    // Los campos coinciden exactamente
    // con Mascota.java.
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
  // AL INICIAR LA PÁGINA
  // ==========================================================

  ngOnInit(): void {

    this.cargarMascotas();

  }


  // ==========================================================
  // CARGAR TODAS LAS MASCOTAS
  // ==========================================================
  //
  // GET /api/mascotas
  //
  // Este endpoint es exclusivo para ADMIN.
  // ==========================================================

  cargarMascotas(): void {

    this.cargando = true;

    this.mensajeError = '';


    this.mascotaServicio
      .listarTodasMascotas()
      .subscribe({


        next: (respuesta) => {

          this.mascotas = respuesta;

          this.cargando = false;


          console.log(
            'Mascotas registradas:',
            respuesta
          );


          this.cd.detectChanges();

        },


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
  // EDITAR MASCOTA
  // ==========================================================

  editarMascota(
    mascota: any
  ): void {


    // Guardamos el ID.
    this.mascotaEditandoId =
      mascota.id;


    // Guardamos el propietario actual.
    this.usuarioActual =
      mascota.usuario;


    // Colocamos los datos actuales
    // dentro del formulario.
    this.mascotaForm.patchValue({

      nombre:
        mascota.nombre,

      especie:
        mascota.especie,

      raza:
        mascota.raza,

      edad:
        mascota.edad,

      sexo:
        mascota.sexo

    });


    this.mensajeError = '';

    this.mensajeExito = '';

    this.mostrarFormulario = true;

  }


  // ==========================================================
  // GUARDAR CAMBIOS
  // ==========================================================

  guardarMascota(): void {


    // Validamos el formulario.
    if (this.mascotaForm.invalid) {

      this.mascotaForm.markAllAsTouched();

      return;

    }


    // Si no existe ID, no tenemos
    // ninguna mascota seleccionada.
    if (this.mascotaEditandoId === null) {

      return;

    }


    // Construimos el JSON que enviamos al backend.
    //
    // Conservamos usuario para que la mascota
    // continúe perteneciendo al mismo dueño.
    const datosMascota = {

      nombre:
        this.mascotaForm.value.nombre,

      especie:
        this.mascotaForm.value.especie,

      raza:
        this.mascotaForm.value.raza,

      edad:
        this.mascotaForm.value.edad,

      sexo:
        this.mascotaForm.value.sexo,

      usuario:
        this.usuarioActual

    };


    console.log(
      'Mascota enviada para actualizar:',
      datosMascota
    );


    // PUT /api/mascotas/{id}
    this.mascotaServicio
      .actualizarMascota(
        this.mascotaEditandoId,
        datosMascota
      )
      .subscribe({


        next: (respuesta) => {

          console.log(
            'Mascota actualizada:',
            respuesta
          );


          this.mensajeExito =
            'Mascota actualizada correctamente.';


          this.cerrarFormulario();


          // Recargamos la información.
          this.cargarMascotas();

        },


        error: (error) => {

          console.error(
            'Error completo al actualizar mascota:',
            error
          );


          this.mensajeError =
            error?.error?.message ||
            error?.error?.mensaje ||
            'No se pudo actualizar la mascota.';


          this.cd.detectChanges();

        }

      });

  }


  // ==========================================================
  // ELIMINAR MASCOTA
  // ==========================================================
  //
  // DELETE /api/mascotas/{id}
  //
  // Solo ADMIN.
  // ==========================================================

  eliminarMascota(
    mascota: any
  ): void {


    const confirmar =
      window.confirm(
        `¿Estás seguro de eliminar a ${mascota.nombre}?`
      );


    if (!confirmar) {

      return;

    }


    this.mascotaServicio
      .eliminarMascota(
        mascota.id
      )
      .subscribe({


        next: () => {

          this.mensajeExito =
            'Mascota eliminada correctamente.';


          this.cargarMascotas();

        },


        error: (error) => {

          console.error(
            'Error al eliminar mascota:',
            error
          );


          this.mensajeError =
            error?.error?.message ||
            error?.error?.mensaje ||
            'No se pudo eliminar la mascota. Puede tener citas asociadas.';


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

    this.usuarioActual = null;

    this.mascotaForm.reset();

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