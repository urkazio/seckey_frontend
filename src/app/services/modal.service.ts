import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface ModalData {
  title: string;
  subtitle?: string; // Optional subtitle
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalSubject = new Subject<ModalData>();

  openModal(data: ModalData) {
    this.modalSubject.next(data);
  }

  getModalData() {
    return this.modalSubject.asObservable();
  }
}
