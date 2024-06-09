import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { DataService } from '../../../services/data-service.service';


@Component({
  selector: 'app-recuperar-pass',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule],
  templateUrl: './recuperar-pass.component.html',
  styleUrl: './recuperar-pass.component.css'
})
export class RecuperarPassComponent {

  emailIncorrecto: boolean = false;
  user = {
    email: "admin@example.com",
  };

  constructor(
    private apiService: ApiService, // Servicio para comunicarse con el backend
    private router: Router, // Router para redirigir al usuario
    private dataService: DataService //Servicio para compartir datos entre componentes
  ) { }

  comprobarMail(){
    this.apiService.comprobarMail(this.user.email).subscribe((res: any) => {

      if (res.status === 200) {
        this.emailIncorrecto = false;
        
        // Navegar a la ruta 'recuperarPassCod' y envviar parametros en la llamada
        const parametros = {
          codigo: res.code,
          email: this.user.email
        };
        this.dataService.setData('parametros', parametros);
        this.router.navigate(['recuperarPassCod']);

      } else {
        this.emailIncorrecto = true; // Establece la variable a true en caso de error
      }
    });
  }
}
