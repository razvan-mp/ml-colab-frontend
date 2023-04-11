import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './services/auth.service';
import {StateManagerService} from "./services/state-manager.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'front-end';
  static readonly BACKEND_URL: string = 'http://localhost:8000/';
  static loggedIn: boolean = false;
  static csrfToken: any;

  constructor(
    private primengConfig: PrimeNGConfig,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    AppComponent.csrfToken = localStorage.getItem('csrfToken');
    this.primengConfig.ripple = true;
    this.authService.getSession();

    const blob = document.getElementById('blob');
    window.onpointermove = (event) => {
      const {clientX, clientY} = event;

      blob?.animate(
        {
          left: `${clientX}px`,
          top: `${clientY}px`,
        },
        {
          duration: 3000,
          fill: 'forwards',
        }
      );
    };
  }

  static hidePlotly(): void {
    setTimeout(() => {
      const aTagsWithHref = document.querySelectorAll('a[href]');
      aTagsWithHref.forEach((aTag) => {
        if (aTag!.getAttribute('href')!.includes('plotly')) {
          aTag.remove();
        }
      });
    }, 100);
  }
}
