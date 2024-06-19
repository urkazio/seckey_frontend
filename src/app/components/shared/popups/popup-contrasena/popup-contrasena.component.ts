import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-popup-contrasena',
  standalone: true,
  imports: [],
  templateUrl: './popup-contrasena.component.html',
  styleUrl: './popup-contrasena.component.css'
})
export class PopupContrasenaComponent {
  @Input() title: string = '';
  @Input() mensaje: string = '';

  constructor(public activeModal: NgbActiveModal) {}

  onCancel() {
    this.activeModal.dismiss();
  }

  onSaveChanges() {
    this.activeModal.close();
  }
}
