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
  tiempoRestante?: string; // Nuevo campo para el tiempo restante
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
      switch (modal) { // Redirigir al usuario a su index en función del rol que tenga
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
        case 'passBorrada':
          localStorage.removeItem("modal")
          localStorage.removeItem("data")
          this.selectedCategoria=data||""; // dejar seleccionada la categoria actual
          this.getPassFromCategoria(data||"") // navegar a la categoria actual
          this.modalService.openOkPoup("Eliminar Contraseña", "La contraseña ha sido eliminada de manera exitosa.");
          break;
        case 'categoriaBorrada':
          localStorage.removeItem("modal")
          this.modalService.openOkPoup("Eliminar Categoría", "La categoría ha sido eliminada de manera exitosa.");
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
        this.contrasenas = contrasenas.map((pass: Password) => {
          // Calcular tiempo restante para cada contraseña
          pass.tiempoRestante = this.calcularTiempoRestante(pass.fecha_exp);
          return pass;
        });
        this.selectedCategoria = categoria;
        this.selectedPassword = null;
        this.categoriaSeleccionada = true;
        // Lanzar intervalo para actualizar tiempo restante cada segundo
        setInterval(() => {
          this.contrasenas.forEach(pass => {
            pass.tiempoRestante = this.calcularTiempoRestante(pass.fecha_exp);
          });
        }, 1000);
      },
      error => {
        console.error('Error fetching passwords:', error);
      }
    );
  }

  showPasswordDetails(password: Password) {
    this.selectedPassword = password;
  }

  async crearCategoria() {
    const nombreCat = await this.modalService.openPopupTextbox("Crear categoría", "Introduce el nombre de la nueva categoría");
    if(nombreCat!=""){
      this.apiService.crearCategoria(this.email, nombreCat).subscribe((res: any) => {
        if (res.status === 200) {
          localStorage.setItem("modal","categoriaCreada")
          localStorage.setItem("data",nombreCat)
          window.location.reload(); // Recargar la página si la inserción fue exitosa
        }if(res.status==409){
          this.modalService.openOkPoup("Crear Categoría", "Ya existe una categoría con dicho nombre.");
        }
      });
    }
  }

  async borrarCategoria() {
    const result = await this.modalService.openOkPoup("Eliminar categoría", "¿Está seguro de que desea eliminar la categoría? Esta acción eliminará TODAS las contraseñas que contiene y no se podrá deshacer.");
    if (result){
      
      if (result && this.selectedCategoria){
        this.apiService.borrarCategoria(this.selectedCategoria.toString()).subscribe((res: any) => {
          if (res.status === 200) {
            localStorage.setItem("modal","categoriaBorrada")
            window.location.reload(); // Recargar la página si la inserción fue exitosa
          }
        });
      }
    }
  }

async crearContrasena() {
  try {
    const passData = await this.modalService.openPopupContrasena("Crear nueva contraseña");
    
    // Verificar que todos los campos requeridos estén llenos
    if (!passData['nombre'] || passData['nombre'] === "" ||
        !passData['usuario'] || passData['usuario'] === "" ||
        !passData['contrasena'] || passData['contrasena'] === "" ||
        !passData['confirmarContrasena'] || passData['confirmarContrasena'] === "" ||
        !passData['fechaExpiracion'] || passData['fechaExpiracion'] === "") {
      
      this.modalService.openOkPoup("ERROR", "Todos los campos son obligatorios.");
      return;
    }

    // Verificar que la contraseña y la confirmación coincidan
    if (passData['contrasena'] !== passData['confirmarContrasena']) {
      this.modalService.openOkPoup("ERROR", "Las contraseñas no coinciden.");
      return; // Salir del método si las contraseñas no coinciden
    }

    // Verificar que la fecha de expiración sea posterior al día actual
    const fechaExpiracion = new Date(passData['fechaExpiracion']);
    const fechaActual = new Date();

    // Calcular la fecha actual + 3 meses
    const fechaMaxima = new Date();
    fechaMaxima.setMonth(fechaMaxima.getMonth() + 3);

    if (fechaExpiracion <= fechaActual || fechaExpiracion > fechaMaxima) {
      this.modalService.openOkPoup("ERROR", "La fecha de expiración debe ser posterior al día actual y no superior a 3 meses.");
      return; // Salir del método si la fecha de expiración no es válida
    }

    // Si se ha llegado a este punto, todos los datos son válidos
    this.apiService.crearContrasena(passData['nombre'], passData['usuario'], passData['contrasena'], passData['fechaExpiracion'], this.selectedCategoria, this.email).subscribe((res: any) => {
      if (res.status === 200) {
        localStorage.setItem("modal", "passCreada");
        localStorage.setItem("data", this.selectedCategoria)
        window.location.reload(); // Recargar la página si la inserción fue exitosa
      }
    });

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
    const result = await this.modalService.openOkPoup("Eliminar Contraseña", "¿Está seguro de que desea eliminar la contraseña?");
    if (result && this.selectedPassword){
      this.apiService.borrarContrasena(this.selectedPassword['id'].toString()).subscribe((res: any) => {
        if (res.status === 200) {
          localStorage.setItem("modal","passBorrada")
          localStorage.setItem("data", this.selectedCategoria)
          window.location.reload(); // Recargar la página si la inserción fue exitosa
        }
      });
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

  private calcularTiempoRestante(fechaExpStr: string): string {

    const fechaExpStrOK = this.formateoFecha(fechaExpStr) //parsear la fecha a yankee
    const fechaExp = new Date(fechaExpStrOK);
    const ahora = new Date();

  
    if (fechaExp <= ahora) {
      return "Contraseña expirada";
    }
  
    const diff = fechaExp.getTime() - ahora.getTime();
  
    // Convert milliseconds to months, days, hours, minutes, and seconds
    const meses = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
    const dias = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diff % (1000 * 60)) / 1000);
  
    // Build the remaining time string in the desired format
    let tiempoRestante = "";
    if (meses > 0) {
      tiempoRestante += `${meses} mes${meses > 1 ? 'es' : ''} `;
    }
    if (dias > 0 || meses > 0) {
      tiempoRestante += `${dias} día${dias > 1 ? 's' : ''} `;
    }
    tiempoRestante += `${this.agregarCero(horas)}h:${this.agregarCero(minutos)}m:${this.agregarCero(segundos)}s`;
  
    return tiempoRestante;
  }
    
  
  private agregarCero(numero: number): string {
    return numero < 10 ? `0${numero}` : `${numero}`;
  }

  private formateoFecha(fechaExpStr: string): string {
    // Separar el día, mes, año y hora de la cadena de fecha
    const partes = fechaExpStr.split(/[ ,]+/);
    
    // Obtener día, mes, año y hora
    const fecha = partes[0];
    const hora = partes[1];

    const partesFecha = fecha.split(/[/]+/);
    const dia = partesFecha[0];
    const mes = partesFecha[1];
    const anio = partesFecha[2];
  
    // Crear la cadena de fecha intercambiando día y mes (FORMATO DE LOS PUTOS INGLESES DE MIERDA)
    const fechaCorregidaStr = `${mes}/${dia}/${anio} ${hora}`;
        
    return fechaCorregidaStr;
  }
  

}
