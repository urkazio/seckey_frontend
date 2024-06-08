import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar-user',
  standalone: true,
  imports: [],
  templateUrl: './navbar-user.component.html',
  styleUrl: './navbar-user.component.css'
})

export class NavbarUserComponent {

  constructor(
    private router: Router // Router para redirigir al usuario
  ) { }

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(["login"]); // Navega hacia la página de inicio de sesión
  }
}
