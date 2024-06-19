import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-popup-editar',
  standalone: true,
  imports: [],
  templateUrl: './popup-editar.component.html',
  styleUrl: './popup-editar.component.css'
})

export class PopupEditarComponent {
  @Input() title: string = '';
  @Input() nombrePass: string = '';
  @Input() usuario: string = '';
  @Input() fechaExp: string = '';

  constructor(public activeModal: NgbActiveModal) {}

  onCancel() {
    this.activeModal.dismiss();
  }

  onSaveChanges() {
    this.activeModal.close();
  }
}
