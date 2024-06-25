import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms'; 

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


  autogenerarContrasena() {
    const longitud = 20; // Longitud de la contraseña
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    const array = new Uint32Array(longitud);
    let contraseña = '';
  
    do {
      window.crypto.getRandomValues(array);
      contraseña = '';
      for (let i = 0; i < longitud; i++) {
        contraseña += caracteres.charAt(array[i] % caracteres.length);
      }
    } while (!this.cumpleRequisitos(contraseña));

    console.log(contraseña)
  
    this.contrasena = contraseña;
    this.confirmarContrasena = contraseña;
  
    if (this.fortaleza > 0) {
      this.fortaleza = 0;
      setTimeout(() => {
        this.calcularFortalezaContrasena();
      }, 200);
    } else {
      this.calcularFortalezaContrasena();
    }
  }
  
  cumpleRequisitos(contraseña: string): boolean {
    const regexMayuscula = /[A-Z]/;
    const regexMinuscula = /[a-z]/;
    const regexDigito = /[0-9]/;
    const regexEspecial = /[!@#$%^&*()]/; // Ajusta los caracteres especiales según tus necesidades
  
    // Verificar que la contraseña cumple con todos los requisitos
    return (contraseña.length === 20 && regexMayuscula.test(contraseña) && regexMinuscula.test(contraseña) && regexDigito.test(contraseña) && regexEspecial.test(contraseña));
  }


  calcularFortalezaContrasena() {
    let fortaleza = 0;
    const regexMayuscula = /[A-Z]/;
    const regexMinuscula = /[a-z]/;
    const regexDigito = /[0-9]/;
    const regexEspecial = /[!@#$%^&*(),.?":{}|<>]/;

    if (this.contrasena.length >= 8) {
      fortaleza += 20;
    }

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