
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-popup-fortaleza',
  standalone: true,
  imports: [],
  templateUrl: './popup-fortaleza.component.html',
  styleUrl: './popup-fortaleza.component.css'
})
export class PopupFortalezaComponent {
  @Input() title: string = '';
  @Input() mensaje: string = '';
  strings: any; // Variable para almacenar los textos

  constructor(
    public activeModal: NgbActiveModal,
  ) {}


  onCancel() {
    this.activeModal.dismiss();
  }

  onSaveChanges() {
    this.activeModal.close();
  }

}
