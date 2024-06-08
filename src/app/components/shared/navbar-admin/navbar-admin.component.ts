import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar-admin',
  standalone: true,
  imports: [],
  templateUrl: './navbar-admin.component.html',
  styleUrl: './navbar-admin.component.css'
})
export class NavbarAdminComponent {

  constructor(
    private router: Router // Router para redirigir al usuario
  ) { }

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(["login"]); // Navega hacia la página de inicio de sesión
  }
}
