import { Component } from '@angular/core';
import { NavbarAdminComponent} from '../../shared/navbar-admin/navbar-admin.component'
import { ApiService } from '../../../services/api.service'


@Component({
  selector: 'app-index-admin',
  standalone: true,
  imports: [NavbarAdminComponent],
  templateUrl: './index-admin.component.html',
  styleUrl: './index-admin.component.css'
})
export class IndexAdminComponent {

  constructor(
    private apiService: ApiService, // Servicio para comunicarse con el backend
  ) { }

  ngOnInit() {
    this.apiService.pruebaAdmin().subscribe(rdo => {
      console.log(rdo); // Imprimir el valor del observable
    });
  }
}
