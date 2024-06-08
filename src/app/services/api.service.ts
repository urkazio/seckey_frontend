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

  register(email: string, password: string) {
    return this.http.post<any>(this.URL + '/guest/register', { email, pass: password });
  }

  comprobarMail(email: string) {
    return this.http.post<any>(this.URL + '/guest/recuperar/comprobar', { email });
  }
}