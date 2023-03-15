import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'front-end';
  static readonly BACKEND_URL: string = "http://localhost:8000/";

  static usernames: string[] = [];
  static emails: string[] = [];

  constructor(private primengConfig: PrimeNGConfig) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
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

  static refreshUserData(): void {
    axios.get(`${this.BACKEND_URL}api/auth/get_existing_user_data`).then((response) => {
      this.usernames = response.data.usernames;
      this.emails = response.data.emails;
    });
  }
}
