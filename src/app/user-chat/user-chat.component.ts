import { Component, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('messageBox') messageBox: any;
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
    this.initialFetch();
    this.startPolling();
  }

  startPolling(): void {
    setInterval(() => {
      this.fetchMessages();
    }, 3000);
  }

  initialFetch(): void {
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
        setTimeout(() => {
          this.messageBox.nativeElement.scrollTo({
            top: this.messageBox.nativeElement.scrollHeight,
            behavior: 'smooth',
          })
        }, 100);
      });
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
        if (this.isScrolledToBottom()) {
          this.scrollToBottom();
        }
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
      .subscribe((res) => {
        this.fetchMessages();
        this.scrollToBottom();
      });
    form.reset();
  }

  scrollToBottom(): void {
    setTimeout(() => {
      this.messageBox.nativeElement.scrollTo({
        top: this.messageBox.nativeElement.scrollHeight,
        behavior: 'smooth',
      });
    }, 100);
  }

  isScrolledToBottom(): boolean {
    return (
      this.messageBox.nativeElement.scrollHeight -
        this.messageBox.nativeElement.clientHeight <=
      this.messageBox.nativeElement.scrollTop + 10
    );
  }
}
