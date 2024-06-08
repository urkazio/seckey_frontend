import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  // atributos para el control
  contrasenasNoCoincide: boolean = false;
  emailNoValido: boolean = false;
  registroFallido: string | null = null;
  registroExitoso: boolean = false;
  user = {
    email: "admin@example.com",
    pass1: "123",
    pass2: "123"
  };

  constructor(
    private apiService: ApiService, // Servicio para comunicarse con el backend
    private router: Router // Router para redirigir al usuario
  ) { }

  registro(){
    this.limpiarVariablesControl();

    //comprobar que las contraseñas coinciden
    if (this.user.pass1 !== this.user.pass2) {
      this.contrasenasNoCoincide = true;
      return; // Salir del método si las contraseñas no coinciden
    }

    //comprobar que la sintaxis del email es correcta
    if (!this.validarEmail(this.user.email)) {
      this.emailNoValido = true;
      return; // Salir del método si email malformado
    }

    //si ambas clausulas son correctas
    if (!this.emailNoValido && !this.contrasenasNoCoincide){
      this.apiService.register(this.user.email, this.user.pass1).subscribe((res: any) => {
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

  limpiarVariablesControl(){
    this.contrasenasNoCoincide= false;
    this.emailNoValido = false;
    this.registroFallido = null;
    this.registroExitoso = false;
  }

  
}
