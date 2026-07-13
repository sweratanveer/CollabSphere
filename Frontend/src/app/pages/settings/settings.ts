import { Component } from '@angular/core';
import { Navbar } from '../../layout/navbar/navbar';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [Navbar],
  templateUrl: './settings.html',
  styleUrls: ['./settings.scss'],
})
export class Settings {

  constructor(

    private auth: Auth,

    private router: Router,

  ) {}

  logout(){

    this.auth.logout();

    this.router.navigate(['/login']);

  }

}
