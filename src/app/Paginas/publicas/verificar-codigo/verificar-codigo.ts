// ==========================================================
// IMPORTACIONES
// ==========================================================

// Component permite crear el componente.
// ChangeDetectorRef ayuda a actualizar la vista
// después de recibir una respuesta del backend.
import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

// CommonModule permite utilizar *ngIf.
import { CommonModule } from '@angular/common';

// Herramientas para formularios reactivos.
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

// Router permite navegar entre páginas.
import { Router } from '@angular/router';

// Servicio de autenticación.
import { AuthServicio }
  from '../../../Servicios/auth-servicio';


@Component({

  selector: 'app-verificar-codigo',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './verificar-codigo.html',

  styleUrl: './verificar-codigo.scss'

})
export class VerificarCodigo {


  // ==========================================================
  // FORMULARIO
  // ==========================================================

  verificarForm: FormGroup;


  // ==========================================================
  // VARIABLES DE CONTROL
  // ==========================================================

  cargando: boolean = false;

  mensajeError: string = '';

  mensajeExito: string = '';


  // El correo NO lo escribe nuevamente el usuario.
  // Lo recuperamos automáticamente.
  correo: string = '';


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(

    private fb: FormBuilder,

    private authServicio: AuthServicio,

    private router: Router,

    private cd: ChangeDetectorRef

  ) {


    // ========================================================
    // FORMULARIO DEL CÓDIGO
    // ========================================================
    //
    // El código enviado por el backend
    // siempre tiene 4 dígitos.
    // ========================================================

    this.verificarForm = this.fb.group({

      codigo: [
        '',
        [
          Validators.required,

          // Solamente permite exactamente 4 números.
          Validators.pattern(/^[0-9]{4}$/)
        ]
      ]

    });


    // ========================================================
    // RECUPERAR CORREO DEL REGISTRO
    // ========================================================

    const correoGuardado =
      sessionStorage.getItem(
        'correoVerificacion'
      );


    if (correoGuardado) {

      this.correo =
        correoGuardado;

    } else {

      // Si alguien entra directamente a esta página
      // sin haberse registrado primero,
      // mostramos un mensaje.
      this.mensajeError =
        'No se encontró un registro pendiente de verificación.';

    }

  }


  // ==========================================================
  // VERIFICAR CÓDIGO
  // ==========================================================

  verificarCodigo(): void {


    // Limpiamos mensajes anteriores.
    this.mensajeError = '';

    this.mensajeExito = '';


    // ========================================================
    // VALIDAR QUE EXISTA EL CORREO
    // ========================================================

    if (!this.correo) {

      this.mensajeError =
        'No se encontró el correo asociado al registro.';

      return;

    }


    // ========================================================
    // VALIDAR FORMULARIO
    // ========================================================

    if (this.verificarForm.invalid) {

      this.verificarForm.markAllAsTouched();

      return;

    }


    const codigo =
      this.verificarForm.value.codigo;


    this.cargando = true;


    // ========================================================
    // ENVIAR VERIFICACIÓN
    // ========================================================
    //
    // Aunque el usuario solamente escribe:
    //
    // código
    //
    // Angular envía internamente:
    //
    // {
    //   correo,
    //   codigo
    // }
    //
    // POST:
    // /api/auth/verificar-codigo
    // ========================================================

    this.authServicio
      .verificarCodigo(
        this.correo,
        codigo
      )
      .subscribe({


        // ====================================================
        // VERIFICACIÓN CORRECTA
        // ====================================================

        next: (respuesta) => {


          console.log(
            'Respuesta de verificación:',
            respuesta
          );


          this.cargando = false;


          this.mensajeExito =
            respuesta?.mensaje ||
            'Cuenta verificada correctamente.';


          // Ya no necesitamos guardar
          // el correo temporalmente.
          sessionStorage.removeItem(
            'correoVerificacion'
          );


          this.cd.detectChanges();


          // Después de verificar correctamente,
          // enviamos al usuario al login.
          //
          // Todavía deberá esperar que un ADMIN
          // apruebe su cuenta.
          setTimeout(() => {

            this.router.navigate([
              '/login'
            ]);

          }, 1500);

        },


        // ====================================================
        // ERROR
        // ====================================================

        error: (error) => {


          console.error(
            'Error completo de verificación:',
            error
          );


          this.cargando = false;


          this.mensajeError =
            error?.error?.mensaje ||
            error?.error?.message ||
            error?.error?.detail ||
            'El código ingresado es incorrecto.';


          this.cd.detectChanges();

        }

      });

  }


  // ==========================================================
  // VOLVER AL REGISTRO
  // ==========================================================

  volverRegistro(): void {

    this.router.navigate([
      '/registro'
    ]);

  }


  // ==========================================================
  // IR AL LOGIN
  // ==========================================================

  irLogin(): void {

    this.router.navigate([
      '/login'
    ]);

  }

}