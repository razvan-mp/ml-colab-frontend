import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  displayModal: boolean = false;
  tabViewIndex: number = 0;
  password: any;
  passwordConfirm: any;

  constructor(private authService: AuthService) {}

  loginUser($event: SubmitEvent, loginForm: HTMLFormElement): void {
    $event.preventDefault();
    const data = Object.fromEntries(new FormData(loginForm as any) as any);
    this.authService.loginUser(data).subscribe((res) => {
      console.log(res);
    });
  }

  registerUser($event: SubmitEvent, registerForm: HTMLFormElement): void {
    $event.preventDefault();
    let data = Object.fromEntries(new FormData(registerForm as any) as any);
    data['password'] = this.password;
    this.authService.registerUser(data).subscribe((res) => {
      console.log(res);
    });
  }

  setIndex(index: number): void {
    this.tabViewIndex = index;
  }
  
  validatePassConfirm(): void {
    const element = document.getElementById('password-confirm-input');
    if (this.passwordConfirm != '' && this.password !== this.passwordConfirm) {
      element?.classList.add('ng-invalid');
      element?.classList.add('ng-dirty');
    } else {
      element?.classList.remove('ng-invalid');
      element?.classList.remove('ng-dirty');
    }
  }
}
