import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'front-end';
  static readonly BACKEND_URL: string = 'http://localhost:8000/';
  static loggedIn: boolean = false;
  static usernames: string[] = [];
  static emails: string[] = [];
  static csrfToken: any;

  constructor(
    private primengConfig: PrimeNGConfig,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    AppComponent.csrfToken = localStorage.getItem('csrfToken');
    this.primengConfig.ripple = true;
    this.authService.getSession();
  }

  get loggedIn(): boolean {
    return AppComponent.loggedIn;
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
