import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ChatService } from '../services/chat.service';
import { StateManagerService } from '../services/state-manager.service';
import { PrivateMessage } from '../models/PrivateMessage';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-team-chat',
  templateUrl: './team-chat.component.html',
  styleUrls: ['./team-chat.component.scss'],
})
export class TeamChatComponent implements OnInit {
  @ViewChild('messageBox') messageBox: any;
  messages: PrivateMessage[] = [];

  get username() {
    return localStorage.getItem('username');
  }

  get selectedTeamName() {
    return this.state.selectedTeamName;
  }

  get selectedTeamId() {
    return this.state.selectedTeam;
  }

  constructor(
    private messageService: MessageService,
    private chatService: ChatService,
    private state: StateManagerService
  ) {}

  ngOnInit(): void {
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
      .getTeamMessages(this.selectedTeamId)
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
          });
        }, 100);
      });
  }

  fetchMessages(): void {
    this.chatService
      .getTeamMessages(this.selectedTeamId)
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

  sendMessageToTeam(event: SubmitEvent, form: HTMLFormElement): void {
    event.preventDefault();
    const message = Object.fromEntries(new FormData(form) as any)['message'];
    if (message === '') return;
    this.chatService
      .sendTeamMessage({
        team_id: this.selectedTeamId,
        message: message,
      })
      .subscribe(() => {
        this.fetchMessages();
        form.reset();
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

  messageUserPrivately(username: string): void {
    this.state.cameFromTeam = true;
    this.state.selectedFriend = username;
    this.state.display = 4;
  }
}
