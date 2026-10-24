// Component permite crear el componente principal de Angular.
import { Component } from '@angular/core';

// RouterOutlet permite mostrar los componentes
// definidos en app.routes.ts.
import { RouterOutlet } from '@angular/router';


@Component({

  // Selector principal de nuestra aplicación.
  selector: 'app-root',

  // Indicamos que el componente es standalone.
  standalone: true,

  // Importamos RouterOutlet para poder utilizar
  // <router-outlet> dentro de app.html.
  imports: [
    RouterOutlet
  ],

  // Archivo HTML principal.
  templateUrl: './app.html',

  // Archivo de estilos principal.
  styleUrl: './app.scss'

})
export class App {

}