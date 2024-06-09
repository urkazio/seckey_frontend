import { Routes } from '@angular/router';
import { LoginComponent } from './components/no_logged/login/login.component';
import { RegistroComponent } from './components/no_logged/registro/registro.component';
import { IndexUserComponent } from './components/users/index-user/index-user.component';
import { IndexAdminComponent } from './components/admins/index-admin/index-admin.component';
import { NavbarAdminComponent } from './components/shared/navbar-admin/navbar-admin.component';
import { NavbarUserComponent } from './components/shared/navbar-user/navbar-user.component';
import { RecuperarPassComponent } from './components/no_logged//recuperar-pass/recuperar-pass.component';
import { RecuperarPassCodigoComponent } from './components/no_logged//recuperar-pass-codigo/recuperar-pass-codigo.component';
import { RecuperarPassNuevapassComponent } from './components/no_logged//recuperar-pass-nuevapass/recuperar-pass-nuevapass.component';
import { SeckeyLogoComponent } from './components/shared/seckey-logo/seckey-logo.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistroComponent },
  { path: 'indexUser', component: IndexUserComponent },
  { path: 'indexAdmin', component: IndexAdminComponent },
  { path: 'navbarAdmin', component: NavbarAdminComponent },
  { path: 'navbarUser', component: NavbarUserComponent },
  { path: 'recuperarPass', component: RecuperarPassComponent },
  { path: 'recuperarPassCod', component: RecuperarPassCodigoComponent },
  { path: 'recuperarPassNuevaPass', component: RecuperarPassNuevapassComponent },
  { path: 'seckeyLogo', component: SeckeyLogoComponent },

  { path:'**', pathMatch: 'full', redirectTo: 'login'} // por defecto redirige al login

];
