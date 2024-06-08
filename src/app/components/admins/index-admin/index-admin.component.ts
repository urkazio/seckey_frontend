import { Component } from '@angular/core';
import { NavbarAdminComponent} from '../../shared/navbar-admin/navbar-admin.component'


@Component({
  selector: 'app-index-admin',
  standalone: true,
  imports: [NavbarAdminComponent],
  templateUrl: './index-admin.component.html',
  styleUrl: './index-admin.component.css'
})
export class IndexAdminComponent {

}
