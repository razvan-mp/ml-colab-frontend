import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AppComponent } from '../app.component';
import { AuthService } from '../services/auth.service';
import { StateManagerService } from '../services/state-manager.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  display: number = 0;
  selectedItem: any = {
    color: '#7C8DE5FF',
    background: 'rgba(255, 255, 255, 0.1)',
  };
  yourNotes: any = {};
  yourTeams: any = {};

  get displaySidebar(): boolean {
    return this._state.displaySidebar;
  }
  set displaySidebar(value: any) {
    this._state.displaySidebar = value;
  }
  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private _state: StateManagerService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('display')) {
      this.display = Number(localStorage.getItem('display'));
    }
    if (this.display === 0) {
      this.yourNotes = this.selectedItem;
      this.yourTeams = {};
    } else {
      this.yourNotes = {};
      this.yourTeams = this.selectedItem;
    }
  }

  setDisplay(value: number): void {
    this.display = value;
    localStorage.setItem('display', value.toString());
    if (this.display === 0) {
      this.yourNotes = this.selectedItem;
      this.yourTeams = {};
    } else {
      this.yourNotes = {};
      this.yourTeams = this.selectedItem;
    }
  }

  logoutUser(): void {
    this.authService.logout().subscribe((res: any) => {
      if (res['status'] === 200) {
        AppComponent.loggedIn = false;
        localStorage.removeItem('csrfToken');
        localStorage.removeItem('username');
        localStorage.removeItem('user_id');
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'You have successfully logged out!',
        });
        this.displaySidebar = false;
        this.authService.getSession();
      }
    });
  }

  whoAmI(): void {
    this.authService
      .whoami()
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Something went wrong. Please try again.',
          });
          return error;
        })
      )
      .subscribe((res: any) => {
        if (res['status'] === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `You are logged in as ${res.body['username']}`,
          });
          localStorage.setItem('username', res.body['username']);
          localStorage.setItem('user_id', res.body['user_id']);
        }
      });
  }
}
