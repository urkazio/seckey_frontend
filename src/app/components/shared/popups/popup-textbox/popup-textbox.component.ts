import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-popup-textbox',
  standalone: true,
  imports: [],
  templateUrl: './popup-textbox.component.html',
  styleUrl: './popup-textbox.component.css'
})
export class PopupTextboxComponent {
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
