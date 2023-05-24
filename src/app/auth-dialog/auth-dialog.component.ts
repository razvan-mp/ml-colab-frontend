import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs';
import { AppComponent } from '../app.component';
import { MessageService } from 'primeng/api';
import { StateManagerService } from '../services/state-manager.service';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss'],
})
export class AuthDialogComponent {
  tabViewIndex: number = 0;
  password: string = '';
  passwordConfirm: string = '';

  bgImageIndigo: string = '';
  bgImageBlue: string = '';
  bgImageRed: string = '';
  showSignupBelow: string = '';
  showLoginBelow: string = '';

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private state: StateManagerService
  ) {}

  get displayModal() {
    return this.state.displayAuthModal;
  }

  set displayModal(value: boolean) {
    this.state.displayAuthModal = value;
  }

  setIndex(index: number) {
    this.tabViewIndex = index;
  }

  loginUser($event: SubmitEvent, loginForm: HTMLFormElement) {
    $event.preventDefault();

    const formData = Object.fromEntries(new FormData(loginForm as any) as any);
    this.authService
      .login(formData['username'] as string, formData['password'] as string)
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.detail,
          });
          return '';
        })
      )
      .subscribe((res: any) => {
        if (res['status'] === 200) {
          this.state.isLoggedIn = true;
          localStorage.setItem('access_token', res.body['access']);
          localStorage.setItem('refresh_token', res.body['refresh']);
          localStorage.setItem('username', formData['username'] as string);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'You have successfully logged in!',
          });
          this.displayModal = false;
        }
        loginForm.reset();
      });
  }

  registerUser($event: SubmitEvent, registerForm: HTMLFormElement): void {
    $event.preventDefault();

    const passwordInput = document.getElementById(
      'password-input'
    ) as HTMLInputElement;
    const passwordConfirmInput = document.getElementById(
      'password-confirm-input'
    ) as HTMLInputElement;
    const formData = Object.fromEntries(
      new FormData(registerForm as any) as any
    );
    const username = formData['username'] as string;
    const email = formData['email'] as string;

    if (username === '' || email === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter a username and email.',
      });
      return;
    }

    if (this.password === '' || this.passwordConfirm === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter a password.',
      });

      return;
    }

    if (this.password.length < 8) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Password must be at least 8 characters long.',
      });
      passwordInput.classList.add('ng-invalid');
      passwordInput.classList.add('ng-dirty');

      setTimeout(() => {
        passwordInput.classList.remove('ng-invalid');
        passwordInput.classList.remove('ng-dirty');
      }, 3500);

      return;
    }

    if (this.password !== this.passwordConfirm) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Passwords do not match. Please try again.',
      });

      passwordInput.classList.add('ng-invalid');
      passwordInput.classList.add('ng-dirty');
      passwordConfirmInput.classList.add('ng-invalid');
      passwordConfirmInput.classList.add('ng-dirty');

      setTimeout(() => {
        passwordInput.classList.remove('ng-invalid');
        passwordInput.classList.remove('ng-dirty');
        passwordConfirmInput.classList.remove('ng-invalid');
        passwordConfirmInput.classList.remove('ng-dirty');
      }, 4500);

      return;
    }

    this.authService
      .register(username, email, this.password)
      .subscribe((res: any) => {
        const status = res['status'];
        let detail = '';
        if (res.body['detail'] !== undefined) {
          detail = res.body['detail'] as string;
        }

        if (status === 200 && detail === 'Successfully registered.') {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: detail,
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: detail,
          });
        }
      });
  }

  slideToSignup(): void {
    this.bgImageIndigo = 'indigo-slide-to-signup';
    this.bgImageBlue = 'blue-slide-to-signup';
    this.bgImageRed = 'red-slide-to-signup';
    this.showSignupBelow = 'show-below';
  }

  slideToLogin(): void {
    this.bgImageIndigo = 'indigo-slide-to-login';
    this.bgImageBlue = 'blue-slide-to-login';
    this.bgImageRed = 'red-slide-to-login';
    this.showLoginBelow = 'show-below';
  }
}
