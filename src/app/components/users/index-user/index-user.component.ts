import { Component, OnInit } from '@angular/core';
import { NavbarUserComponent } from '../../shared/navbar-user/navbar-user.component';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { PopupOkComponent } from '../../shared/popups/popup-ok/popup-ok.component';
import { PopupTextboxComponent } from '../../shared/popups/popup-textbox/popup-textbox.component';
import { ModalService } from '../../../services/modal.service';


interface Password {
  id: number;
  nombre: string;
  username: string;
  hash: string;
  fecha_exp: string;
  categoria: string;
}

@Component({
  selector: 'app-index-user',
  standalone: true,
  imports: [NavbarUserComponent, FormsModule, CommonModule, PopupOkComponent, PopupTextboxComponent],
  templateUrl: './index-user.component.html',
  styleUrls: ['./index-user.component.css']
})

export class IndexUserComponent implements OnInit {
  email: string = "";
  contrasenas: Password[] = [];
  categorias: string[] = [];
  selectedCategoria: string = "";
  selectedPassword: Password | null = null; // Variable para almacenar la contraseña seleccionada

  constructor(
    private apiService: ApiService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.email = decodedToken.usuario;
        this.getCategorias();
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }

  getCategorias() {
    this.apiService.getCategorias(this.email).subscribe(
      (categorias: any) => {
        this.categorias = categorias;
      },
      error => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  getPassFromCategoria(categoria: string) {
    this.apiService.getPassFromCategoria(this.email, categoria).subscribe(
      (contrasenas: any) => {
        this.contrasenas = contrasenas;
        this.selectedCategoria = categoria;
        this.selectedPassword = null; // Limpiamos la contraseña seleccionada al cambiar de categoría
      },
      error => {
        console.error('Error fetching passwords:', error);
      }
    );
  }

  showPasswordDetails(password: Password) {
    this.selectedPassword = password;
  }


  openModal(title: string, subtitle?: string) {
    this.modalService.openModal({ title, subtitle });
  }

  showConfirmationModal() {
    this.openModal('Confirmation', 'Are you sure you want to proceed?');
  }

  showInformationModal() {
    this.openModal('Information', 'This is an informative message.');
  }
}