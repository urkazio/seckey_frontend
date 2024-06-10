import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];

    if (typeof window !== 'undefined' && localStorage) {
      const token = localStorage.getItem('token');
      console.log(token)

      if (token !== null) {

        interface MiUsuario {
          usuario: string;
          rol: string;
        }

        const decoded = jwtDecode<MiUsuario>(token); // Decodificar el token de sesion para obtener el rol del recien logeado
        const { rol } = decoded;

        // Comprobar si está autenticado y además el rol es el adecuado
        if (rol !== expectedRole) {
          this.router.navigate(["login"]);
          return false;
          
        } else {
          return true;
        }
      } else {
        this.router.navigate(["login"]);
        return false;
      }
    } else {
      return false;
    }
  }
}
