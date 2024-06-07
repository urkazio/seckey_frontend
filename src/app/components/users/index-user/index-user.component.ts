import { Component } from '@angular/core';
import { NavbarUserComponent} from '../../shared/navbar-user/navbar-user.component'

@Component({
  selector: 'app-index-user',
  standalone: true,
  imports: [NavbarUserComponent],
  templateUrl: './index-user.component.html',
  styleUrl: './index-user.component.css'
})
export class IndexUserComponent {

}
