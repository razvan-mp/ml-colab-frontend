import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: any;

  constructor() {}

  connect(): void {
    const options = {
      transportOptions: {
        polling: {
          extraHeaders: {
            'Authorization': localStorage.getItem('access_token'),
          }
        }
      }
    };

    this.socket = io.connect('http://192.168.1.3:3000', options);
  }

  joinRoom(roomId: string, username: string) {
    this.socket.emit('joinRoom', { roomId, userId: username });
  }
}
