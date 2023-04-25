import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FriendsService } from '../services/friends.service';
import { StateManagerService } from '../services/state-manager.service';

@Component({
  selector: 'app-user-socials-modals',
  templateUrl: './user-socials-modals.component.html',
  styleUrls: ['./user-socials-modals.component.scss'],
})
export class UserSocialsModalsComponent {
  constructor(
    private messageService: MessageService,
    private friendsService: FriendsService,
    private state: StateManagerService
  ) {}

  get displayAddFriendModal() {
    return this.state.displayAddFriendModal;
  }

  hideAddFriendModal(): void {
    this.state.displayAddFriendModal = false;
    this.state.displaySidebar = true;
  }

  sendFriendRequest($event: SubmitEvent, addFriendForm: HTMLFormElement) {
    $event.preventDefault();
    const payload = Object.fromEntries(
      new FormData(addFriendForm as any) as any
    )['username'];

    if (payload === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter a username',
      });
      return;
    }

    this.friendsService.sendFriendRequest(payload).subscribe((res: any) => {
      if (res['detail'] !== 'Friend request sent successfully!') {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: res['detail'],
        });
      } else {
        this.hideAddFriendModal();
        this.messageService.add({
          severity: 'success',
          summary: 'Friend request sent',
          detail: `Friend request sent to ${payload}`,
        });
      }
    });
  }
}
