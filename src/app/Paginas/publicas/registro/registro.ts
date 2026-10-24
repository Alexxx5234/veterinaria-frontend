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

  selector: 'app-registro',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './registro.html',

  styleUrl: './registro.scss'

})
export class Registro {


  registroForm: FormGroup;


  cargando: boolean = false;

  mensajeError: string = '';

  mensajeExito: string = '';


  // Mostrar / ocultar contraseñas.
  mostrarPassword: boolean = false;

  mostrarConfirmarPassword: boolean = false;


  constructor(

    private fb: FormBuilder,

    private authServicio: AuthServicio,

    private router: Router,

    private cd: ChangeDetectorRef

  ) {


    this.registroForm = this.fb.group({

      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      correo: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],

      confirmarPassword: [
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


  cambiarVisibilidadConfirmacion(): void {

    this.mostrarConfirmarPassword =
      !this.mostrarConfirmarPassword;

  }


  // ==========================================================
  // REGISTRAR
  // ==========================================================

  registrar(): void {


    this.mensajeError = '';

    this.mensajeExito = '';


    if (this.registroForm.invalid) {

      this.registroForm.markAllAsTouched();

      return;

    }


    const password =
      this.registroForm.value.password;


    const confirmarPassword =
      this.registroForm.value.confirmarPassword;


    if (
      password !== confirmarPassword
    ) {

      this.mensajeError =
        'Las contraseñas no coinciden.';

      return;

    }


    const nombre =
      this.registroForm.value.nombre;


    const correo =
      this.registroForm.value.correo;


    this.cargando = true;


    this.authServicio
      .registrar(
        nombre,
        correo,
        password
      )
      .subscribe({


        next: (respuesta) => {


          console.log(
            'Respuesta del registro:',
            respuesta
          );


          this.cargando = false;


          this.mensajeExito =
            respuesta?.mensaje ||
            'Usuario registrado correctamente.';


          // Guardamos temporalmente el correo.
          sessionStorage.setItem(
            'correoVerificacion',
            correo
          );


          this.cd.detectChanges();


          // Ir a verificar código.
          setTimeout(() => {

            this.router.navigate([
              '/verificar-codigo'
            ]);

          }, 1000);

        },


        error: (error) => {


          console.error(
            'Error completo del registro:',
            error
          );


          this.cargando = false;


          this.mensajeError =
            error?.error?.mensaje ||
            error?.error?.message ||
            error?.error?.detalle ||
            error?.error?.detail ||
            'No se pudo registrar la cuenta.';


          this.cd.detectChanges();

        }

      });

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