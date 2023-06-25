import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './services/auth.service';
import { StateManagerService } from './services/state-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'front-end';
  static readonly BACKEND_URL: string = 'http://192.168.0.102:8000/';

  get isLoggedIn(): boolean {
    return this.state.isLoggedIn;
  }

  set isLoggedIn(value: boolean) {
    this.state.isLoggedIn = value;
  }

  constructor(
    private primengConfig: PrimeNGConfig,
    private authService: AuthService,
    private state: StateManagerService
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
      localStorage.clear();
    }
    this.primengConfig.ripple = true;

    const blob = document.getElementById('blob');
    window.onpointermove = (event) => {
      const { clientX, clientY } = event;

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
