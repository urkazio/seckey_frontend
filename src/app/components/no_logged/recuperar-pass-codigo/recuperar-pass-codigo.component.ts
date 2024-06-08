import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router'; // Importa ActivatedRoute
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

  codigo: string ="";
  codigoIncorrecto: boolean = false;
  user = {
    codigo: "",
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService //Servicio para compartir datos entre componentes
  ) { }

  ngOnInit() {

    //recuperar los parametros pasados por la vista llamadora
    const parametros = this.dataService.getData('cod_recuperacion');

    if (parametros) {
      this.codigo = parametros.codigo;
    }
  }

  comprobarCodigo(): void {  // Comprobar si el código introducido coincide con el código recibido por correo
    console.log(this.codigo)
    console.log(this.user.codigo)

    if (this.user.codigo == this.codigo) {
      console.log("CODIGO COINCIDE")
      this.codigoIncorrecto = false;
    } else {
      this.codigoIncorrecto = true;
    }
  }
}
