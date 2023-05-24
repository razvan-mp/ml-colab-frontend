import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { StateManagerService } from '../services/state-manager.service';
import { AppComponent } from '../app.component';
import { UserService } from '../services/user.service';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-settings',
  providers: [MessageService],
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
})
export class UserSettingsComponent {
  displayItem: number = 0;

  constructor(
    private messageService: MessageService,
    private state: StateManagerService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  get displayUserSettingsModal() {
    return this.state.displayUserSettingsModal;
  }

  fetchUsername(): string {
    return localStorage.getItem('username') as string;
  }

  setDisplayItem(item: number): void {
    this.displayItem = item;
  }

  hideUserSettingsModal(): void {
    this.state.displayUserSettingsModal = false;
    this.state.displaySidebar = true;
  }

  changeUsername($event: SubmitEvent, form: HTMLFormElement): void {
    const data = Object.fromEntries(new FormData(form as any) as any);

    this.userService
      .changeUsername(data)
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error,
          });
          return err;
        })
      )
      .subscribe((res: any) => {
        if (res.detail === 'Username changed successfully.') {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.detail,
          });

          localStorage.setItem('username', data['new_username']);
          document.getElementById(
            'modal-title'
          )!.innerText = `Hi, ${data['new_username']}!`;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: res.detail,
          });
        }
      });
  }

  changePassword($event: SubmitEvent, form: HTMLFormElement): void {
    const data = Object.fromEntries(new FormData(form as any) as any);

    if (data['new_password'] !== data['new_password_confirm']) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Passwords do not match.',
      });
      return;
    }

    this.userService
      .changePassword(data)
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error,
          });
          return err;
        })
      )
      .subscribe((res: any) => {
        if (res.detail === 'Password changed successfully.') {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.detail + ' You will be logged out.',
          });
          setTimeout(() => {
            this.authService.logout();
            this.state.isLoggedIn = false;
            localStorage.clear();
            window.location.reload();
          }, 1000);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: res.detail,
          });
        }
      });
  }

  deleteAccount($event: SubmitEvent, form: HTMLFormElement): void {
    const data = Object.fromEntries(new FormData(form as any) as any);

    this.userService
      .deleteAccount(data)
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error,
          });
          return err;
        })
      )
      .subscribe((res: any) => {
        if (res.detail === 'Account deleted successfully.') {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.detail + ' You will be logged out.',
          });
          setTimeout(() => {
            this.authService.logout();
            this.state.isLoggedIn = false;
            localStorage.clear();
            window.location.reload();
          }, 1000);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: res.detail,
          });
        }
      });
  }

  resetForm(): void {
    const usernameField = document.getElementById('user-form-username') as any;
    usernameField.value = localStorage.getItem('username') as string;
  }
}
