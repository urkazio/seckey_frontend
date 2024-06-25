import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private URL = '/api'; // Cambia la URL base al proxy

  constructor(private http: HttpClient) { }

  login(user: any) {
    return this.http.post<any>(this.URL + '/guest/login', user);
  }

  register(email: string, password: string, nombre: string) {
    return this.http.post<any>(this.URL + '/guest/register', { email, pass: password, nombre });
  }

  comprobarMail(email: string) {
    return this.http.post<any>(this.URL + '/guest/recuperar/comprobar', { email });
  }

  reestablecerPass(email: string, pass: string) {
    return this.http.post<any>(this.URL + '/guest/recuperar/reestablecer', { email, pass });
  }

  pruebaAdmin() {
    return this.http.post<any>(this.URL + '/admin/prueba', { });
  }

  getCategorias(email:string) {
    return this.http.post<any>(this.URL + '/user/getCategorias', { email });
  }

  getPassFromCategoria(email: string, categoria: string) {
    return this.http.post(this.URL + '/user/getPassFromCategoria', { email, categoria });
  }
  
  crearCategoria(email: string, nombreCat: string) {
    return this.http.post(this.URL + '/user/crearCategoria', { email, nombreCat });
  }

  crearContrasena(nombre: string, username: string, pass: string, fecha_exp: string, nombreCat: string, owner: string ) {
    return this.http.post(this.URL + '/user/crearContrasena', { nombre, username, pass, fecha_exp, nombreCat, owner });
  }

  borrarContrasena(passId: string ) {
    return this.http.post(this.URL + '/user/borrarContrasena', { passId });
  }

  borrarCategoria(nombre: string ) {
    return this.http.post(this.URL + '/user/borrarCategoria', { nombre });
  }

  editarContrasena(nombre: string , username: string, contrasena: string, fecha_exp: string, id: number) {
    return this.http.post(this.URL + '/user/editarContrasena', { nombre, username, contrasena, fecha_exp, id });
  }
  
  
}
