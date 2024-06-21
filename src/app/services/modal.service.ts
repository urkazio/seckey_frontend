import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PopupOkComponent } from '../components/shared/popups/popup-ok/popup-ok.component';
import { PopupTextboxComponent } from '../components/shared/popups/popup-textbox/popup-textbox.component';
import { PopupContrasenaComponent } from '../components/shared/popups/popup-contrasena/popup-contrasena.component';
import { PopupEditarComponent } from '../components/shared/popups/popup-editar/popup-editar.component';



@Injectable({
  providedIn: 'root'
})

export class ModalService {

  constructor(private modalService: NgbModal) { }

  openOkPoup(title: string, mensaje: string): Promise<boolean> {
    const modalRef = this.modalService.open(PopupOkComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.mensaje = mensaje;

    //devuelve true si ha pulsado el boton aceptar
    return new Promise<boolean>((resolve) => {
      const acceptButton = document.querySelector('.modal-footer button.btn-primary');
      acceptButton?.addEventListener('click', () => {
        resolve(true);
      });
    });
  }

  openPopupTextbox(title: string, mensaje: string): Promise<string> {
    const modalRef = this.modalService.open(PopupTextboxComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.mensaje = mensaje;

    return new Promise<string>((resolve) => {
      const acceptButton = document.querySelector('.boton-aceptar');
      acceptButton?.addEventListener('click', () => {
        const inputBox = document.querySelector('.mensaje') as HTMLTextAreaElement;
        if (inputBox) {
          const mensaje = inputBox.value;
          resolve(mensaje);
        }
      });
    });
  }

  openPopupContrasena(title: string): Promise<{ [key: string]: string }> {
    const modalRef = this.modalService.open(PopupContrasenaComponent);
    modalRef.componentInstance.title = title;

    return modalRef.result.then((result) => {
      return result as { [key: string]: string };
    }).catch((error) => {
      console.log('Modal cerrado sin datos:', error);
      return {}; // Retornar un objeto vacío o manejar el error según necesites
    });
  }
  

  openPopupEditarContra(title: string, nombrePass: string, usuario: string, fechaExp: string): Promise<string> {
    const modalRef = this.modalService.open(PopupEditarComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.nombrePass = nombrePass;
    modalRef.componentInstance.usuario = usuario;
    modalRef.componentInstance.fechaExp = fechaExp;

    return new Promise<string>((resolve) => {
      const acceptButton = document.querySelector('.boton-aceptar');
      acceptButton?.addEventListener('click', () => {
        const inputBox = document.querySelector('.mensaje') as HTMLTextAreaElement;
        if (inputBox) {
          const mensaje = inputBox.value;
          resolve(mensaje);
        }
      });
    });
  }

}
