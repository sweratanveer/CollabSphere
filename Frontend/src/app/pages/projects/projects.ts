import { Component } from '@angular/core';
import { Navbar } from '../../layout/navbar/navbar';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [Navbar],
  templateUrl: './projects.html',
  styleUrls: ['./projects.scss'],
})
export class Projects {}
