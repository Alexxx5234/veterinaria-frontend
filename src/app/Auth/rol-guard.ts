// inject permite utilizar servicios dentro de un Guard funcional.
import { inject } from '@angular/core';

// Herramientas necesarias para proteger las rutas.
import {
  CanActivateFn,
  Router
} from '@angular/router';

// Servicio de autenticación.
import { AuthServicio } from '../Servicios/auth-servicio';


// ==========================================================
// GUARD DE ROLES
// ==========================================================

export const rolGuard: CanActivateFn = (route, state) => {

  // Servicio donde tenemos token y rol.
  const authServicio = inject(AuthServicio);

  // Router para realizar redirecciones.
  const router = inject(Router);


  // ========================================================
  // COMPROBAR SESIÓN
  // ========================================================

  if (!authServicio.estaAutenticado()) {

    return router.createUrlTree([
      '/login'
    ]);

  }


  // ========================================================
  // OBTENER ROLES
  // ========================================================

  // Rol guardado durante el login.
  const rolUsuario =
    authServicio.obtenerRol();

  // Rol permitido para la ruta.
  const rolPermitido =
    route.data['rol'];


  // ========================================================
  // PERMITIR ACCESO
  // ========================================================

  if (rolUsuario === rolPermitido) {

    return true;

  }


  // ========================================================
  // REDIRECCIONES
  // ========================================================

  // Si ADMIN intenta entrar a una página USER.
  if (rolUsuario === 'ADMIN') {

    return router.createUrlTree([
      '/admin/dashboard'
    ]);

  }


  // Si USER intenta entrar a una página ADMIN.
  if (rolUsuario === 'USER') {

    return router.createUrlTree([
      '/usuario/dashboard'
    ]);

  }


  // Rol desconocido.
  return router.createUrlTree([
    '/login'
  ]);

};