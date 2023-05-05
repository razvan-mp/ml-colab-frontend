import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { StateManagerService } from '../services/state-manager.service';
import { ChatService } from '../services/chat.service';
import { PrivateMessage } from '../models/PrivateMessage';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-user-chat',
  providers: [MessageService],
  templateUrl: './user-chat.component.html',
  styleUrls: ['./user-chat.component.scss'],
})
export class UserChatComponent implements OnInit {
  messages: PrivateMessage[] = [];
  username: string = '';

  constructor(
    private messageService: MessageService,
    private state: StateManagerService,
    private chatService: ChatService
  ) {}

  get selectedFriend(): string {
    return this.state.selectedFriend;
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('username') as string;
    this.fetchMessages();
    this.startPolling();
  }

  startPolling(): void {
    setInterval(() => {
      this.fetchMessages();
    }, 2000);
  }

  fetchMessages(): void {
    this.chatService
      .getChatMessages(this.selectedFriend)
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
          return error;
        })
      )
      .subscribe((res: PrivateMessage[]) => {
        this.messages = res;
      });
  }

  setDisplay(value: number): void {
    this.state.display = value;
  }

  sendMessageToUser($event: SubmitEvent, form: HTMLFormElement): void {
    $event.preventDefault();

    const data = Object.fromEntries(new FormData(form as any) as any);

    this.chatService
      .sendMessage({
        message: data['message'],
        username: this.selectedFriend,
      })
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
          return error;
        })
      )
      .subscribe((res) => {this.fetchMessages()});
    form.reset();
  }
}
