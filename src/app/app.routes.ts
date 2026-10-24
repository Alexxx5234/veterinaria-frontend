// Routes permite definir las rutas de navegación
// de nuestra aplicación Angular.
import { Routes } from '@angular/router';


// ==========================================================
// COMPONENTES PÚBLICOS
// ==========================================================

// Página de inicio de sesión.
import { LoginCompents }
  from './Paginas/publicas/login-compents/login-compents';

// Página para registrar una nueva cuenta.
import { Registro }
  from './Paginas/publicas/registro/registro';

// Página para verificar el código enviado al correo.
import { VerificarCodigo }
  from './Paginas/publicas/verificar-codigo/verificar-codigo';


// ==========================================================
// COMPONENTES PRIVADOS
// ==========================================================

// Dashboard para usuarios normales.
import { DashboardUsuario }
  from './Paginas/privadas/dashboard-usuario/dashboard-usuario';

// Dashboard para administradores.
import { DashboardAdmin }
  from './Paginas/privadas/dashboard-admin/dashboard-admin';

// Página de mascotas del usuario.
import { Mascotas }
  from './Paginas/privadas/mascotas/mascotas';

// Página de citas del usuario.
import { Citas }
  from './Paginas/privadas/citas/citas';

// Página de servicios disponibles para el usuario.
import { Servicios }
  from './Paginas/privadas/servicios/servicios';

// Página de veterinarios disponibles para el usuario.
import { Veterinarios }
  from './Paginas/privadas/veterinarios/veterinarios';

// Página de administración de usuarios.
import { AdminUsuarios }
  from './Paginas/privadas/admin-usuarios/admin-usuarios';

// Página de administración de servicios.
import { AdminServicios }
  from './Paginas/privadas/admin-servicios/admin-servicios';

// Página de administración de veterinarios.
import { AdminVeterinarios }
  from './Paginas/privadas/admin-veterinarios/admin-veterinarios';

// Página de administración de mascotas.
import { AdminMascotas }
  from './Paginas/privadas/admin-mascotas/admin-mascotas';

// Página de administración de citas.
import { AdminCitas }
  from './Paginas/privadas/admin-citas/admin-citas';


// ==========================================================
// GUARDS
// ==========================================================

// Comprueba que exista una sesión iniciada.
import { authGuard }
  from './Auth/auth-guard';

// Comprueba que el usuario tenga el rol correcto.
import { rolGuard }
  from './Auth/rol-guard';


// ==========================================================
// RUTAS
// ==========================================================

export const routes: Routes = [


  // ========================================================
  // RUTA PRINCIPAL
  // ========================================================

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },


  // ========================================================
  // LOGIN
  // ========================================================

  {
    path: 'login',
    component: LoginCompents
  },


  // ========================================================
  // REGISTRO
  // ========================================================
  // Es pública porque todavía no existe JWT.

  {
    path: 'registro',
    component: Registro
  },


  // ========================================================
  // VERIFICACIÓN DE CUENTA
  // ========================================================
  // También es pública.
  // El correo se obtiene desde sessionStorage.

  {
    path: 'verificar-codigo',
    component: VerificarCodigo
  },


  // ========================================================
  // DASHBOARD USER
  // ========================================================

  {
    path: 'usuario/dashboard',

    component: DashboardUsuario,

    canActivate: [
      authGuard,
      rolGuard
    ],

    data: {
      rol: 'USER'
    }
  },


  // ========================================================
  // MIS MASCOTAS
  // ========================================================

  {
    path: 'usuario/mascotas',

    component: Mascotas,

    canActivate: [
      authGuard,
      rolGuard
    ],

    data: {
      rol: 'USER'
    }
  },


  // ========================================================
  // MIS CITAS
  // ========================================================

  {
    path: 'usuario/citas',

    component: Citas,

    canActivate: [
      authGuard,
      rolGuard
    ],

    data: {
      rol: 'USER'
    }
  },


  // ========================================================
  // SERVICIOS
  // ========================================================

  {
    path: 'usuario/servicios',

    component: Servicios,

    canActivate: [
      authGuard,
      rolGuard
    ],

    data: {
      rol: 'USER'
    }
  },


  // ========================================================
  // VETERINARIOS
  // ========================================================

  {
    path: 'usuario/veterinarios',

    component: Veterinarios,

    canActivate: [
      authGuard,
      rolGuard
    ],

    data: {
      rol: 'USER'
    }
  },


  // ========================================================
  // DASHBOARD ADMIN
  // ========================================================

  {
    path: 'admin/dashboard',

    component: DashboardAdmin,

    canActivate: [
      authGuard,
      rolGuard
    ],

    data: {
      rol: 'ADMIN'
    }
  },


  // ========================================================
  // ADMINISTRACIÓN DE USUARIOS
  // ========================================================

  {
    path: 'admin/usuarios',

    component: AdminUsuarios,

    canActivate: [
      authGuard,
      rolGuard
    ],

    data: {
      rol: 'ADMIN'
    }
  },


  // ========================================================
  // ADMINISTRACIÓN DE SERVICIOS
  // ========================================================

  {
    path: 'admin/servicios',

    component: AdminServicios,

    canActivate: [
      authGuard,
      rolGuard
    ],

    data: {
      rol: 'ADMIN'
    }
  },


  // ========================================================
  // ADMINISTRACIÓN DE VETERINARIOS
  // ========================================================

  {
    path: 'admin/veterinarios',

    component: AdminVeterinarios,

    canActivate: [
      authGuard,
      rolGuard
    ],

    data: {
      rol: 'ADMIN'
    }
  },


  // ========================================================
  // ADMINISTRACIÓN DE MASCOTAS
  // ========================================================

  {
    path: 'admin/mascotas',

    component: AdminMascotas,

    canActivate: [
      authGuard,
      rolGuard
    ],

    data: {
      rol: 'ADMIN'
    }
  },


  // ========================================================
  // ADMINISTRACIÓN DE CITAS
  // ========================================================

  {
    path: 'admin/citas',

    component: AdminCitas,

    canActivate: [
      authGuard,
      rolGuard
    ],

    data: {
      rol: 'ADMIN'
    }
  },


  // ========================================================
  // RUTA NO ENCONTRADA
  // ========================================================

  {
    path: '**',
    redirectTo: 'login'
  }

];