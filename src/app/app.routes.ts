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
import { AdminUsersComponent } from './components/admins/admin-users/admin-users.component';
import { NavbarAdmin2Component } from './components/shared/navbar-admin2/navbar-admin2.component';
import { SeckeyLogoComponent } from './components/shared/seckey-logo/seckey-logo.component';
import { AuthGuard } from './guards/auth.guard'


export const routes: Routes = [

  // --------------------- user: no_logged ----------------------
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistroComponent },
  { path: 'recuperarPass', component: RecuperarPassComponent },
  { path: 'recuperarPassCod', component: RecuperarPassCodigoComponent },
  { path: 'recuperarPassNuevaPass', component: RecuperarPassNuevapassComponent },


  // --------------------- user: logged_admin ---------------------
  { path: 'indexAdmin', component: IndexAdminComponent, canActivate:[AuthGuard], data:{ expectedRole: 'admin' } },
  { path: 'AdminUsers', component: AdminUsersComponent, canActivate:[AuthGuard], data:{ expectedRole: 'admin' } },

  // --------------------- user: logged_user ----------------------
  { path: 'indexUser', component: IndexUserComponent, canActivate:[AuthGuard], data:{ expectedRole: 'user' } },


  // -------------------------- shared  ---------------------------
  { path: 'navbarAdmin', component: NavbarAdminComponent },
  { path: 'navbarUser', component: NavbarUserComponent },
  { path: 'seckeyLogo', component: SeckeyLogoComponent },


  // -------------------------- default  ---------------------------
  { path:'**', pathMatch: 'full', redirectTo: 'login'} // por defecto redirige al login

];
