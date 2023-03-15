import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { MessageService } from 'primeng/api';
import { catchError } from 'rxjs/operators';
import { AppComponent } from '../app.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-homepage',
  providers: [MessageService],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  displayModal: boolean = false;

  constructor(
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    AppComponent.refreshUserData();
  }

  checkUserExists(): void {
    AppComponent.refreshUserData();
    const username = (document.getElementById('username') as HTMLInputElement)
      .value;
    const input = document.getElementById('username') as HTMLInputElement;
    if (AppComponent.usernames.includes(username)) {
      input.classList.add('ng-invalid');
      input.classList.add('ng-dirty');
    } else {
      input.classList.remove('ng-invalid');
      input.classList.remove('ng-dirty');
    }
  }

  registerUser($event: SubmitEvent, userDataForm: HTMLFormElement): void {
    $event.preventDefault();
    const data = Object.fromEntries(new FormData(userDataForm as any) as any);
    this.authService
      .registerUser(data)
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error registering user',
          });
          return err;
        })
      )
      .subscribe((data: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User registered successfully',
        });
      });
  }
}
