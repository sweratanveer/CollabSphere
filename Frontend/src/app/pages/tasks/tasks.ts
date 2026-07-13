import { Component } from '@angular/core';
import { Navbar } from '../../layout/navbar/navbar';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [Navbar],
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.scss'],
})
export class Tasks {}
