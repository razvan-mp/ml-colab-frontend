import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AppComponent } from '../app.component';
import { StateManagerService } from '../services/state-manager.service';

@Component({
  selector: 'app-header',
  providers: [MessageService],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private state: StateManagerService) {}
  isLoggedIn: boolean = this.state.isLoggedIn;

  ngOnInit(): void {
    setInterval(() => {
      this.isLoggedIn = this.state.isLoggedIn;
    }, 100);

    window.addEventListener('click', (event) => {
      const menu = document.getElementById('algo-menu');
      const menuToggle = document.getElementById('menu-toggle');
      if (event.target !== menu && event.target !== menuToggle) {
        menu?.classList.add('hidden');
      }
    });
  }

  showMenu(): void {
    const menu = document.getElementById('algo-menu');
    menu?.classList.toggle('hidden');
  }

  displaySidebar(): void {
    this.state.displaySidebar = true;
  }

  displayAuthModal(): void {
    this.state.displayAuthModal = true;
  }
}
