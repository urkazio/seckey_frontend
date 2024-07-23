import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-popup-editar-user',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './popup-editar-user.component.html',
  styleUrl: './popup-editar-user.component.css'
})
export class PopupEditarUserComponent {

  @Input() title: string = '';
  @Input() nombre: string = '';
  @Input() email: string = '';

  constructor(public activeModal: NgbActiveModal) {}

  onCancel() {
    this.activeModal.dismiss();
  }

  onSaveChanges() {
    const datosContrasena = {
      nombre: this.nombre,
      email: this.email,

    };
    this.activeModal.close(datosContrasena);
  }

}

