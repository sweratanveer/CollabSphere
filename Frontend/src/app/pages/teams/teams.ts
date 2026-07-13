import { Component } from '@angular/core';
import { Navbar } from '../../layout/navbar/navbar';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [Navbar],
  templateUrl: './teams.html',
  styleUrls: ['./teams.scss'],
})
export class Teams {}
