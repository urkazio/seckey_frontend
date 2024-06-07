import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Añade esta importación
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  contrasenaIncorrecta: boolean = false;
  user = {
    email: "admin@example.com",
    pass: "123"
  };

  constructor(
    private apiService: ApiService, // Servicio para comunicarse con el backend
    private router: Router // Router para redirigir al usuario
  ) { }

  login() {
    this.apiService.login(this.user).subscribe((res: any) => {

      if (res === 'Usuario o clave incorrectos') {
        this.contrasenaIncorrecta = true; // Establece la variable a true en caso de error
      } else {
        console.log(res);
        localStorage.setItem('token', res); //se guarda el token obtenido en localStorage
        this.redirigirTrasLogin();
      }
    });
  }

  redirigirTrasLogin() {
    const token = localStorage.getItem('token');

    if (token !== null) {
      // Interfaz para el objeto decodificado del token
      interface MiUsuario {
        usuario: string;
        rol: string;
      }

      const decodedToken = jwtDecode<MiUsuario>(token); //Decodificar el token de sesion para obtener el rol del recien logeado

      switch (decodedToken.rol){ //Redirigir al usuario a su index en funcion del rol que tenga
        case 'admin':
          this.router.navigate(['indexAdmin'])
          break;

        case 'user':
          this.router.navigate(['indexUser'])
          break;
      }
      
    }
  }
}
