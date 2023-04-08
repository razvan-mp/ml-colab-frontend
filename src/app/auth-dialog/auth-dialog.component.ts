import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs';
import { AppComponent } from '../app.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss'],
})
export class AuthDialogComponent {
  displayModal: boolean = false;
  tabViewIndex: number = 0;
  password: string = '';
  passwordConfirm: string = '';

  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) {}

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
          AppComponent.loggedIn = true;
          localStorage.setItem('username', formData['username'] as string);
          localStorage.setItem('user_id', res.body['user_id']);
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
}
