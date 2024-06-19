import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { SeckeyLogoComponent } from '../../shared/seckey-logo/seckey-logo.component';
import { DataService } from '../../../services/data-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    SeckeyLogoComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  contrasenaIncorrecta: boolean = false;
  user = {
    email: "urko@example.com",
    pass: "1234ABC@"
  };

  constructor(
    private apiService: ApiService, // Servicio para comunicarse con el backend
    private router: Router, // Router para redirigir al usuario
    private dataService: DataService, // Router para redirigir al usuario
  ) { }

  ngOnInit() {
    if (typeof window !== 'undefined' && localStorage) {
      const token = localStorage.getItem('token');
      localStorage.removeItem('token');
    }

  }

  login() {
    this.apiService.login(this.user).subscribe((res: any) => {
      if (res === 'Usuario o clave incorrectos') {
        this.contrasenaIncorrecta = true; // Establece la variable a true en caso de error
      } else {
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

      const decodedToken = jwtDecode<MiUsuario>(token); // Decodificar el token de sesion para obtener el rol del recien logeado

      switch (decodedToken.rol) { // Redirigir al usuario a su index en funcion del rol que tenga
        case 'admin':
          this.router.navigate(['indexAdmin'])
          break;

        case 'user':
          console.log("voy al user")
          this.router.navigate(['indexUser']);
          break;
      }
    }
  }

  recuperarPass() {
    this.router.navigate(['recuperarPass']);
  }
}
