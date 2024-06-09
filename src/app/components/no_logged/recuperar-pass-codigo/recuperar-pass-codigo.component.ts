import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Importa ActivatedRoute
import { SeckeyLogoComponent } from '../../shared/seckey-logo/seckey-logo.component'; // Importa ActivatedRoute
import { DataService } from '../../../services/data-service.service';


@Component({
  selector: 'app-recuperar-pass-codigo',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule,
    SeckeyLogoComponent], 
  templateUrl: './recuperar-pass-codigo.component.html',
  styleUrl: './recuperar-pass-codigo.component.css'
})

export class RecuperarPassCodigoComponent {

  email: string ="";
  codigo: string ="";
  codigoIncorrecto: boolean = false;
  user = {
    codigo: "",
  };

  constructor(
    private router: Router,
    private dataService: DataService //Servicio para compartir datos entre componentes
  ) { }

  ngOnInit() {

    //recuperar los parametros pasados por la vista llamadora
    const parametros = this.dataService.getData('parametros');

    if (parametros) {
      this.codigo = parametros.codigo;
      this.email = parametros.email;
    }
  }

  comprobarCodigo(): void {  // Comprobar si el código introducido coincide con el código recibido por correo
    console.log(this.codigo)
    console.log(this.user.codigo)

    if (this.user.codigo == this.codigo) {
      this.codigoIncorrecto = false;
      // Navegar a la ruta 'recuperarPassCod' y envviar parametros en la llamada
      const parametros = {email: this.email};
      this.dataService.setData('parametros', parametros);
      this.router.navigate(['recuperarPassNuevaPass'])
    } else {
      this.codigoIncorrecto = true;
    }
  }
}
