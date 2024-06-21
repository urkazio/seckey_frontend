import { Component, OnInit } from '@angular/core';
import { NavbarUserComponent } from '../../shared/navbar-user/navbar-user.component';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { ModalService } from '../../../services/modal.service';
import { ConstantPool } from '@angular/compiler';


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
  categoriaSeleccionada: boolean = false;
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

      const modal = localStorage.getItem('modal');
      const data = localStorage.getItem('data');
      switch (modal) { // Redirigir al usuario a su index en funcion del rol que tenga
        case 'categoriaCreada':
          localStorage.removeItem("modal")
          localStorage.removeItem("data")
          this.modalService.openOkPoup("Crear categoría", "La categoría '" +data+ "' ha sido creada de manera exitosa.");
          break;
        case 'passCreada':
          localStorage.removeItem("modal")
          localStorage.removeItem("data")
          this.selectedCategoria=data||""; // dejar seleccionada la categoria actual
          this.getPassFromCategoria(data||"") // navegar a la categoria actual
          this.modalService.openOkPoup("Crear nueva contraseña", "La contraseña ha sido creada de manera exitosa.");
        break;
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
        this.categoriaSeleccionada = true;
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
    const nombreCat = await this.modalService.openPopupTextbox("Crear categoría", "Introduce el nombre de la nueva categoría");
    if(nombreCat!=""){
      this.apiService.crearCategoria(this.email, nombreCat).subscribe((res: any) => {
        if (res.status === 200) {
          localStorage.setItem("modal","categoriaCreada")
          localStorage.setItem("data",nombreCat)
          window.location.reload(); // Recargar la página si la inserción fue exitosa
        }
      });
    }
  }

  async borrarCategoria() {
    const result = await this.modalService.openOkPoup("Borrar categoría", "¿Está seguro de que desea borrar la categoría? Esta acción eliminará todas las contraseñas que contiene y no se podrá deshacer.");
    if (result){
      // llamada a la api
    }
  }

  async crearContrasena() {
    try {
      const passData = await this.modalService.openPopupContrasena("Crear nueva contraseña");
      
      // Verificar que todos los campos requeridos estén llenos
      if (passData['nombre'] === undefined) {
        this.modalService.openOkPoup("ERROR", "Todos los campos son obligatorios.");

      } else {
        if (passData['nombre'] != "" && passData['usuario'] != "" && passData['contrasena'] != "" && passData['confirmarContrasena'] != "" && passData['fechaExpiracion'] != "") {
          
          // Verificar que la contraseña y la confirmación coincidan
          if (passData['contrasena'] !== passData['confirmarContrasena']) {
            this.modalService.openOkPoup("ERROR", "Las contraseñas no coinciden.");
            return; // Salir del método si las contraseñas no coinciden
          }
    
          // Verificar que la fecha de expiración sea posterior al día actual
          const fechaExpiracion = new Date(passData['fechaExpiracion']);
          const fechaActual = new Date();
          if (fechaExpiracion <= fechaActual) {
            this.modalService.openOkPoup("ERROR", "La fecha de expiración debe ser posterior al día actual");
            return; // Salir del método si la fecha de expiración no es válida
          }
    
          console.log(passData['nombre'])

          // Si se ha llegado a este punto, todos los datos son válidos
          this.apiService.crearContrasena(passData['nombre'], passData['usuario'], passData['contrasena'], passData['fechaExpiracion'], this.selectedCategoria, this.email).subscribe((res: any) => {
            if (res.status === 200) {
              localStorage.setItem("modal", "passCreada");
              localStorage.setItem("data", this.selectedCategoria)
              window.location.reload(); // Recargar la página si la inserción fue exitosa
            }
          });
  
        }else{
          this.modalService.openOkPoup("ERROR", "Todos los campos son obligatorios.");
        }      }
  
    } catch (error) {
      console.error('Error al crear contraseña:', error);
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