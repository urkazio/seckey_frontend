import { Component, OnInit } from '@angular/core';
import { NavbarAdmin2Component } from '../../shared/navbar-admin2/navbar-admin2.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { ModalService } from '../../../services/modal.service';

interface User {
  nombre: string;
  email: string;
  rol: string;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [NavbarAdmin2Component, FormsModule, CommonModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {

  users: User[] = [];
  paginatedUsers: User[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(
    private apiService: ApiService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.getUsers();

    const modal = localStorage.getItem('modal');
      const data = localStorage.getItem('data');
      switch (modal) { // Redirigir al usuario a su index en función del rol que tenga
        case 'userBorrado':
          localStorage.removeItem("modal")
          localStorage.removeItem("data")
          this.modalService.openOkPoup("Crear categoría", "El usuario asociado al email '" +data+ "' ha sido eliminado exitosamente.");
          break;
        case 'userBorrado':
          localStorage.removeItem("modal")
          this.modalService.openOkPoup("Editar usuario", "Los datos del usuario han sido actualizados exitosamente.");
          break;
      }
  }

  getUsers(): void {
    this.apiService.getUsers().subscribe(
      (users: any) => {
        this.users = users;
        this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
        this.updatePaginatedUsers();
      },
      error => {
        console.error('Error:', error);
      }
    );
  }



  async editUser(emailAntiguo: string) {
    // Buscar el usuario por email
    const userToEdit = this.users.find(user => user.email === emailAntiguo);
    
    if (!userToEdit) {
      this.modalService.openOkPoup("ERROR", "Usuario no encontrado.");
      return;
    }

    // Pasarle todos los datos para que se muestren autorrellenados
    const datosContrasena = await this.modalService.openPopupEditarUser("Editar Usuario", userToEdit.nombre, userToEdit.email);
    
    // Verificar que todos los campos requeridos estén llenos
    if (!datosContrasena['nombre'] || datosContrasena['nombre'] === "" || !datosContrasena['email'] || datosContrasena['email'] === "") {
      this.modalService.openOkPoup("ERROR", "Todos los campos son obligatorios.");
      return;
    } 


    // Si se ha llegado a este punto, todos los datos son válidos
    this.apiService.editUser(datosContrasena['nombre'], datosContrasena['email'], emailAntiguo).subscribe((res: any) => {
      if (res.status === 200) {
        localStorage.setItem("modal","userEditado")
        window.location.reload(); // Recargar la página si la inserción fue exitosa
      }
    });


  }

  async deleteUser(email: string) {
    const rdo = await this.modalService.openOkPoup(
      "Eliminar Usuario",
      "Si elimina al usuario actual, esta acción no se podrá deshacer. Se borrará toda la información del usuario, incluidas sus categorías y contraseñas asociadas."
    );
    if (rdo) {
      this.apiService.deleteUser(email).subscribe((res: any) => {
        if (res.status === 200) {
          localStorage.setItem("modal","userBorrado")
          localStorage.setItem("data", email)
          window.location.reload(); // Recargar la página si la inserción fue exitosa
        }
      });

    }
  }


  // ++++++++++++++++++++++++++ PAGINACIÓN +++++++++++++++++++++++++

  updatePaginatedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedUsers();
    }
  }

  getPages(): number[] {
    if (this.totalPages <= 5) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    } else {
      if (this.currentPage <= 3) {
        return [1, 2, 3, 4, 5];
      } else if (this.currentPage > this.totalPages - 3) {
        return Array.from({ length: 5 }, (_, i) => this.totalPages - 4 + i);
      } else {
        return Array.from({ length: 5 }, (_, i) => this.currentPage - 2 + i);
      }
    }
  }

  getRemainingPages(): number[] {
    if (this.currentPage <= 3) {
      return Array.from({ length: this.totalPages - 5 }, (_, i) => i + 6);
    } else {
      return Array.from({ length: this.totalPages - this.currentPage - 2 }, (_, i) => this.currentPage + 3 + i);
    }
  }
}
