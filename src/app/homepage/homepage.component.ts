import { Component } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent {
  constructor() {}

  scroll(target: string) {
    const el = document.getElementById(target)!;
    el.scrollIntoView({ behavior: 'smooth' });
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }
}
