import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AppComponent } from '../app.component';
import { AuthService } from '../services/auth.service';
import { StateManagerService } from '../services/state-manager.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  selectedItem: any = {
    color: '#7C8DE5FF',
    background: 'rgba(255, 255, 255, 0.1)',
  };
  yourNotes: any = {};
  yourTeams: any = {};
  yourSocial: any = {};

  get display() {
    return this.state.display;
  }

  set display(value: number) {
    this.state.display = value;
  }

  get displayUserTeam(): boolean {
    return this.state.displayUserTeam;
  }

  set displayUserTeam(value: boolean) {
    this.state.displayUserTeam = value;
  }

  get displaySidebar(): boolean {
    return this.state.displaySidebar;
  }
  set displaySidebar(value: any) {
    this.state.displaySidebar = value;
  }
  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private chatService: ChatService,
    private state: StateManagerService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('display')) {
      this.display = Number(localStorage.getItem('display'));
    }
    this.updateDisplay();
  }

  setDisplay(value: number): void {
    this.display = value;
    localStorage.setItem('display', value.toString());
    this.updateDisplay();
  }

  updateDisplay(): void {
    if (this.display === 0) {
      this.clearTeamInfoFromState();
      this.yourTeams = {};
      this.yourSocial = {};
      this.yourNotes = this.selectedItem;
    } else if (this.display === 1) {
      this.yourNotes = {};
      this.yourSocial = {};
      this.yourTeams = this.selectedItem;
    } else {
      this.clearTeamInfoFromState();
      this.yourNotes = {};
      this.yourTeams = {};
      this.yourSocial = this.selectedItem;
    }
  }

  clearTeamInfoFromState(): void {
    this.state.selectedTeam = -1;
    this.state.selectedTeamName = '';
    this.state.selectedTeamDescription = '';
    this.state.selectedTeamUsers = [];
  }

  logoutUser(): void {
    this.authService.logout().subscribe((res: any) => {
      if (res['status'] === 200) {
        AppComponent.loggedIn = false;
        localStorage.removeItem('acess_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        localStorage.removeItem('user_id');
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'You have successfully logged out!',
        });
        this.displaySidebar = false;
      }
    });
  }

  displayUserSettingsModal() {
    this.state.displaySidebar = false;
    this.state.displayUserSettingsModal = true;
  }
}
