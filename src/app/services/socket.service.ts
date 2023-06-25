import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
            Authorization: localStorage.getItem('access_token'),
          },
        },
      },
    };

    this.socket = io.connect('http://192.168.0.102:3000', options);
  }

  joinRoom(roomId: string, userId: string) {
    this.socket.emit('join-room', roomId, userId);
  }

  onRoomNotFound(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('room-not-found', () => observer.next());
    });
  }

  onRoomFull(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('room-full', () => observer.next());
    });
  }

  onUserConnected(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('user-connected', (userId: any) => observer.next(userId));
    });
  }

  onUserDisconnected(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('user-disconnected', (userId: any) =>
        observer.next(userId)
      );
    });
  }

  sendOffer(
    roomId: string,
    description: RTCSessionDescriptionInit,
    userId: string
  ) {
    this.socket.emit('send-offer', roomId, description, userId);
  }

  onOfferReceived(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('receive-offer', (description: any) =>
        observer.next(description)
      );
    });
  }

  sendAnswer(
    roomId: string,
    description: RTCSessionDescriptionInit,
    userId: string
  ) {
    this.socket.emit('send-answer', roomId, description, userId);
  }

  onAnswerReceived(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('receive-answer', (description: any) =>
        observer.next(description)
      );
    });
  }

  disconnect(roomId: string, userId: string) {
    this.socket.emit('disconnect', roomId, userId);
  }

  createRoom() {
    this.socket.emit('create-room');

    return new Observable((observer) => {
      this.socket.on('room-created', (roomId: any) => observer.next(roomId));
    });
  }

  endCall(roomId: string, userId: string) {
    this.socket.emit('end-call', roomId, userId);
  }
}
