import {
  Component,
  HostListener,
} from '@angular/core';

import {
  RouterOutlet,
} from '@angular/router';

import { Navbar } from './layout/navbar/navbar';

import { Auth } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Navbar,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {

  constructor(
    public auth: Auth,
  ) {}

  @HostListener(
    'window:pageshow',
    ['$event'],
  )
  onPageShow(
    event: PageTransitionEvent,
  ) {

    if (event.persisted) {

      window.location.reload();

    }

  }

}