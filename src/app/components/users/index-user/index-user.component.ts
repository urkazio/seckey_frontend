import { Component, OnInit } from '@angular/core';
import { NavbarUserComponent } from '../../shared/navbar-user/navbar-user.component';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
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
  imports: [NavbarUserComponent, FormsModule, CommonModule],
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
    if (token) { // obtener el id del usuario y buscar sus categorias
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
        this.selectedPassword = null;
      },
      error => {
        console.error('Error fetching passwords:', error);
      }
    );
  }

  showPasswordDetails(password: Password) {
    this.selectedPassword = password;
  }

  // ------------ acciones y modales ------------
  async crearCategoria() {
    // llamada a la api para calcular fortaleza
    const result = await this.modalService.openMensajePopup("Crear categoría", "Introduce el nombre de la nueva categoría");
  }

  async borrarCategoria() {
    const result = await this.modalService.openOkPoup("Borrar categoría", "¿Está seguro de que desea borrar la categoría? Esta acción eliminará todas las contraseñas que contiene y no se podrá deshacer.");
    if (result){
      // llamada a la api
    }
  }

  async crearContrasena() {
    const result = await this.modalService.openPopupContrasena("Crear nueva contraseña");
    if (result){
      // llamada a la api
    }
  }

  async editarContrasena() {
    // Pasarle todos los datos para que se muestren autorrellenados
    const result = await this.modalService.openPopupEditarContra("Editar contraseña seleccionada", this.selectedPassword?.nombre || '', this.selectedPassword?.username|| '', this.selectedPassword?.fecha_exp|| '' );
    if (result){
      // llamada a la api
    }
  }
  

  async borrarPass() {
    const result = await this.modalService.openOkPoup("Borrar Contraseña", "¿Está seguro de que desea borrar la contraseña?");
    if (result){
      // llamada a la api
    }  
  }

  async calcularFortaleza() {
    // llamada a la api para calcular fortaleza
    const result = await this.modalService.openOkPoup("Calcular fortaleza", "La fortaleza es de x");
  }

  copyToClipboard(text: string) {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }


}