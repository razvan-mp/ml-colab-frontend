import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, of } from 'rxjs';
import { AppComponent } from '../app.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  providers: [MessageService],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  displayModal: boolean = false;
  displaySidebar: boolean = false;
  tabViewIndex: number = 0;
  password: string = '';
  passwordConfirm: string = '';
  isLoggedIn: boolean = false;

  constructor(
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    setInterval(() => {
      this.isLoggedIn = AppComponent.loggedIn;
    });

    window.addEventListener('click', (event) => {
      const menu = document.getElementById('algo-menu');
      const menuToggle = document.getElementById('menu-toggle');
      if (event.target !== menu && event.target !== menuToggle) {
        menu?.classList.add('hidden');
      }
    });
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
          console.log(res);
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
        this.hideSidebar();
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

  setIndex(index: number): void {
    this.tabViewIndex = index;
  }

  showMenu(): void {
    const menu = document.getElementById('algo-menu');
    menu?.classList.toggle('hidden');
  }

  openSidebar(): void {
    this.displaySidebar = true;
  }

  hideSidebar(): void {
    this.displaySidebar = false;
  }
}
