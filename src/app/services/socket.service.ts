import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { AppComponent } from '../app.component';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: any;

  constructor() {}

  connect(): void {
    const options = {
      
      transports: ['websocket'],
    };

    this.socket = io.connect('http://192.168.1.3:3000', options);
  }

  joinRoom(roomId: string, username: string) {
    const csrfToken = AppComponent.csrfToken;
    this.socket.emit('joinRoom', { roomId, userId: username, csrfToken });
  }
}
