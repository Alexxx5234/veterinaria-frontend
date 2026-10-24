// ==========================================================
// IMPORTACIONES
// ==========================================================

import {
  Component,
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

import { AuthServicio }
  from '../../../Servicios/auth-servicio';


@Component({

  selector: 'app-login-compents',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './login-compents.html',

  styleUrl: './login-compents.scss'

})
export class LoginCompents {


  // ==========================================================
  // FORMULARIO
  // ==========================================================

  loginForm: FormGroup;


  // ==========================================================
  // VARIABLES DE CONTROL
  // ==========================================================

  mensajeError: string = '';

  cargando: boolean = false;


  // Controla si la contraseña se muestra.
  mostrarPassword: boolean = false;


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(

    private fb: FormBuilder,

    private authServicio: AuthServicio,

    private router: Router,

    private cd: ChangeDetectorRef

  ) {


    this.loginForm = this.fb.group({

      correo: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        Validators.required
      ]

    });

  }


  // ==========================================================
  // MOSTRAR / OCULTAR CONTRASEÑA
  // ==========================================================

  cambiarVisibilidadPassword(): void {

    this.mostrarPassword =
      !this.mostrarPassword;

  }


  // ==========================================================
  // INICIAR SESIÓN
  // ==========================================================

  iniciarSesion(): void {


    this.mensajeError = '';


    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;

    }


    this.cargando = true;


    const correo =
      this.loginForm.value.correo;

    const password =
      this.loginForm.value.password;


    this.authServicio
      .login(
        correo,
        password
      )
      .subscribe({


        // ====================================================
        // LOGIN CORRECTO
        // ====================================================

        next: (respuesta) => {


          console.log(
            'Login correcto:',
            respuesta
          );


          this.authServicio.guardarSesion(
            respuesta.token,
            respuesta.rol
          );


          this.cargando = false;

          this.cd.detectChanges();


          if (respuesta.rol === 'ADMIN') {

            this.router.navigate([
              '/admin/dashboard'
            ]);

            return;

          }


          if (respuesta.rol === 'USER') {

            this.router.navigate([
              '/usuario/dashboard'
            ]);

            return;

          }


          this.mensajeError =
            'El rol del usuario no es válido.';


          this.cd.detectChanges();

        },


        // ====================================================
        // ERROR
        // ====================================================

        error: (error) => {


          console.error(
            'Error completo al iniciar sesión:',
            error
          );


          this.cargando = false;


          const mensajeBackend =

            error?.error?.mensaje ||

            error?.error?.message ||

            error?.error?.detalle ||

            error?.error?.detail ||

            '';


          const mensaje =
            mensajeBackend.toLowerCase();


          // CUENTA PENDIENTE
          if (
            mensaje.includes('aprobada')
          ) {

            this.mensajeError =
              '⏳ Tu cuenta todavía está pendiente de aprobación por el administrador.';

          }


          // CUENTA NO VERIFICADA
          else if (
            mensaje.includes('verificada')
          ) {

            this.mensajeError =
              '📧 Tu cuenta todavía no ha sido verificada. Revisa el código enviado a tu correo.';

          }


          // CUENTA RECHAZADA
          else if (
            mensaje.includes('rechazada')
          ) {

            this.mensajeError =
              '❌ Tu cuenta fue rechazada por el administrador.';

          }


          // BLOQUEADA / DESACTIVADA
          else if (
            mensaje.includes('bloqueada') ||
            mensaje.includes('desactivada')
          ) {

            this.mensajeError =
              '🔒 Tu cuenta se encuentra bloqueada o desactivada.';

          }


          // CONTRASEÑA
          else if (
            mensaje.includes('contraseña incorrecta')
          ) {

            this.mensajeError =
              '🔑 La contraseña ingresada es incorrecta.';

          }


          // USUARIO
          else if (
            mensaje.includes('usuario no encontrado')
          ) {

            this.mensajeError =
              '👤 No existe una cuenta registrada con ese correo.';

          }


          else {

            this.mensajeError =
              mensajeBackend ||
              'No fue posible iniciar sesión.';

          }


          this.cd.detectChanges();

        }

      });

  }

}