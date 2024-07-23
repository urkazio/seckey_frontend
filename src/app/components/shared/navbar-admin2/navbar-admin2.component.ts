import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-admin2',
  standalone: true,
  imports: [],
  templateUrl: './navbar-admin2.component.html',
  styleUrl: './navbar-admin2.component.css'
})
export class NavbarAdmin2Component {


  constructor(
    private router: Router // Router para redirigir al usuario
  ) { }

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(["login"]); // Navega hacia la página de inicio de sesión
  }
}