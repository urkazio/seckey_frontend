import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { SeckeyLogoComponent } from '../../shared/seckey-logo/seckey-logo.component'

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule,
    SeckeyLogoComponent],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  // atributos para el control
  contrasenasNoCoincide: boolean = false;
  nombreNoValido: boolean = false;
  emailNoValido: boolean = false;
  contrasenaNoValida: boolean = false; // variable de control para la contraseña
  registroFallido: string | null = null;
  registroExitoso: boolean = false;
  user = {
    nombre: "",
    email: "admin@example.com",
    pass1: "1234ABC@",
    pass2: "1234ABC@"
  };

  constructor(
    private apiService: ApiService, // Servicio para comunicarse con el backend
    private router: Router // Router para redirigir al usuario
  ) { }

  registro() {
    this.limpiarVariablesControl();
  
    // comprobar que el nombre no esté vacío
    if (!this.user.nombre || this.user.nombre.trim() === '') {
      this.nombreNoValido = true;
      return; // Salir del método si el nombre está vacío
    }
  
    // comprobar que las contraseñas coinciden
    if (this.user.pass1 !== this.user.pass2) {
      this.contrasenasNoCoincide = true;
      return; // Salir del método si las contraseñas no coinciden
    }
  
    // comprobar que la sintaxis del email es correcta
    if (!this.validarEmail(this.user.email)) {
      this.emailNoValido = true;
      return; // Salir del método si email malformado
    }
  
    // comprobar que la contraseña es válida
    if (!this.validarContrasena(this.user.pass1)) {
      this.contrasenaNoValida = true;
      return; // Salir del método si la contraseña no cumple con los requisitos
    }
  
    // si todas las clausulas son correctas
    if (!this.emailNoValido && !this.contrasenasNoCoincide && !this.contrasenaNoValida && !this.nombreNoValido) {
      this.apiService.register(this.user.email, this.user.pass1, this.user.nombre).subscribe((res: any) => {
        if (res.status === 200) { // Registro exitoso y mostrar mensaje
          this.registroExitoso = true; 
          setTimeout(() => {
            this.router.navigate(['/login']); // Redirigir al usuario al login después de 2 segundos
          }, 2000);
        } else {
          // Manejar el error en el registro recibido desde backend
          this.registroFallido = res.message;
        }
      }, error => {
        // Manejar errores de la llamada al API
        this.registroFallido = 'ERROR: Error de conexión';
        console.error(error);
      });
    }
  }
  

  validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validarContrasena(contrasena: string): boolean {
    const contrasenaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return contrasenaRegex.test(contrasena);
  }

  limpiarVariablesControl(){
    this.contrasenasNoCoincide = false;
    this.emailNoValido = false;
    this.contrasenaNoValida = false;
    this.registroFallido = null;
    this.registroExitoso = false;
    this.nombreNoValido = false;
  }

}
