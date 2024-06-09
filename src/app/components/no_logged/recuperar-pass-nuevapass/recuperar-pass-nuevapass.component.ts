import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Importa ActivatedRoute
import { SeckeyLogoComponent } from '../../shared/seckey-logo/seckey-logo.component'; // Importa ActivatedRoute
import { ApiService } from '../../../services/api.service';
import { DataService } from '../../../services/data-service.service';


@Component({
  selector: 'app-recuperar-pass-nuevapass',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule,
    SeckeyLogoComponent,
    SeckeyLogoComponent], 
  templateUrl: './recuperar-pass-nuevapass.component.html',
  styleUrl: './recuperar-pass-nuevapass.component.css'
})
export class RecuperarPassNuevapassComponent {

  email: string ="";
  contrasenasNoCoincide: boolean = false;
  contrasenaNoValida: boolean = false; // variable de control para la contraseña
  resetFallido: string | null = null;
  resetExitoso: boolean = false;
  user = {
    pass1: "",
    pass2: ""
  };

  constructor(
    private router: Router,
    private apiService: ApiService, // Servicio para comunicarse con el backend
    private dataService: DataService //Servicio para compartir datos entre componentes
  ) { }

  ngOnInit() {

    //recuperar los parametros pasados por la vista llamadora
    const parametros = this.dataService.getData('parametros');

    if (parametros) {
      this.email = parametros.email;
    }
  }

  resetPass(){

    this.limpiarVariablesControl();

    // comprobar que las contraseñas coinciden
    if (this.user.pass1 !== this.user.pass2) {
      this.contrasenasNoCoincide = true;
      return; // Salir del método si las contraseñas no coinciden
    }

    // comprobar que la contraseña es válida
    if (!this.validarContrasena(this.user.pass1)) {
      this.contrasenaNoValida = true;
      return; // Salir del método si la contraseña no cumple con los requisitos
    }

    // si todas las clausulas son correctas
    if (!this.contrasenasNoCoincide && !this.contrasenaNoValida) {
      this.apiService.reestablecerPass(this.email, this.user.pass1).subscribe((res: any) => {
        if (res.status === 200) { // Registro exitoso y mostrar mensaje
          this.resetExitoso = true; 
          setTimeout(() => {
            this.router.navigate(['/login']); // Redirigir al usuario al login después de 2 segundos
          }, 2000);
        } else {
          // Manejar el error en el registro recibido desde backend
          this.resetFallido = res.message;
        }
      }, error => {
        // Manejar errores de la llamada al API
        this.resetFallido = 'ERROR: Error de conexión';
        console.error(error);
      });
    }
  }


  validarContrasena(contrasena: string): boolean {
    const contrasenaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return contrasenaRegex.test(contrasena);
  }

  limpiarVariablesControl(){
    this.contrasenasNoCoincide = false;
    this.contrasenaNoValida = false;
  }

}
