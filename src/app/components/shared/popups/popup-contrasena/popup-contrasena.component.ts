import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms'; // Asegúrate de importar FormsModule

@Component({
  standalone: true,
  imports: [FormsModule],
  selector: 'app-popup-contrasena',
  templateUrl: './popup-contrasena.component.html',
  styleUrls: ['./popup-contrasena.component.css']
})

export class PopupContrasenaComponent {
  @Input() title: string = '';
  nombre: string = '';
  usuario: string = '';
  contrasena: string = '';
  confirmarContrasena: string = '';
  fechaExpiracion: string = '';
  fortaleza: number = 0; // Variable para almacenar la fortaleza de la contraseña

  constructor(public activeModal: NgbActiveModal) {}

  onCancel() {
    this.activeModal.dismiss();
  }

  onSaveChanges() {
    const datosContrasena = {
      nombre: this.nombre,
      usuario: this.usuario,
      contrasena: this.contrasena,
      confirmarContrasena: this.confirmarContrasena,
      fechaExpiracion: this.fechaExpiracion
    };
    this.activeModal.close(datosContrasena);
  }

  // Función para calcular la fortaleza de la contraseña
  calcularFortalezaContrasena() {
    let fortaleza = 0;

    // Verificar longitud mínima
    if (this.contrasena.length >= 8) {
      fortaleza += 20;
    }

    // Verificar mayúsculas, minúsculas, números y caracteres especiales
    const regexMayuscula = /[A-Z]/;
    const regexMinuscula = /[a-z]/;
    const regexDigito = /[0-9]/;
    const regexEspecial = /[!@#$%^&*(),.?":{}|<>]/;

    if (regexMayuscula.test(this.contrasena)) {
      fortaleza += 20;
    }

    if (regexMinuscula.test(this.contrasena)) {
      fortaleza += 20;
    }

    if (regexDigito.test(this.contrasena)) {
      fortaleza += 20;
    }

    if (regexEspecial.test(this.contrasena)) {
      fortaleza += 20;
    }

    this.fortaleza = fortaleza;
  }

}
