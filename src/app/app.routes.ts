import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { IndexUserComponent } from './components/users/index-user/index-user.component';
import { IndexAdminComponent } from './components/admins/index-admin/index-admin.component';
import { NavbarAdminComponent } from './components/shared/navbar-admin/navbar-admin.component';
import { NavbarUserComponent } from './components/shared/navbar-user/navbar-user.component';



export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistroComponent },
  { path: 'indexUser', component: IndexUserComponent },
  { path: 'indexAdmin', component: IndexAdminComponent },
  { path: 'navbarAdmin', component: NavbarAdminComponent },
  { path: 'navbarUser', component: NavbarUserComponent },
  { path:'**', pathMatch: 'full', redirectTo: 'login'} // por defecto redirige al login

];
