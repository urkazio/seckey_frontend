import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../../services/modal.service';

@Component({
  selector: 'app-popup-ok',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup-ok.component.html',
  styleUrls: ['./popup-ok.component.css']
})
export class PopupOkComponent {
  title = '';
  subtitle?: string;

  constructor(private modalService: ModalService) {
    this.modalService.getModalData().subscribe(data => {
      this.title = data.title;
      this.subtitle = data.subtitle;
    });
  }
}
