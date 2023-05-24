import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SocketService } from '../services/socket.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-video-call',
  providers: [MessageService, ConfirmationService],
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.scss'],
})
export class VideoCallComponent implements OnInit, OnDestroy {
  peerConnection!: RTCPeerConnection;
  displayHelp: boolean = false;
  callStarted: boolean = false;

  @ViewChild('localVideo') localVideo!: ElementRef;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef;
  @ViewChild('videoCallWindow') videoCallWindowRef!: ElementRef;
  localStream!: MediaStream;
  remoteStream!: MediaStream;
  roomId: string = '';

  constructor(
    private socketService: SocketService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.peerConnection = new RTCPeerConnection();
    this.socketService.connect();
  }

  ngOnDestroy(): void {
    this.localStream.getTracks().forEach((track) => track.stop());
    this.remoteStream.getTracks().forEach((track) => track.stop());
    this.socketService.disconnect(
      this.roomId,
      localStorage.getItem('username')!
    );
  }

  showHelp(event: Event): void {
    event.preventDefault();
    this.displayHelp = true;
  }

  createRoom() {
    this.socketService.createRoom().subscribe((roomId: any) => {
      this.roomId = roomId;
      this.copyRoomId();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Room created successfully. RoomID copied to clipboard.',
      });
    });
  }

  async joinRoom() {
    this.callStarted = true;
    this.videoCallWindowRef.nativeElement.classList.remove('hidden');

    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    this.localVideo.nativeElement.srcObject = this.localStream;

    this.localStream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, this.localStream);
    });

    this.peerConnection.ontrack = (event) => {
      if (!this.remoteStream) {
        this.remoteStream = new MediaStream();
        this.remoteVideo.nativeElement.srcObject = this.remoteStream;
      }
      if (event.track.kind === 'video' || event.track.kind === 'audio') {
        this.remoteStream.addTrack(event.track);
      }
    };

    this.socketService.joinRoom(this.roomId, localStorage.getItem('username')!);

    this.socketService.onRoomNotFound().subscribe(() => {
      console.log("Room doesn't exist");
      this.removeAllStreams();
      return;
    });

    this.socketService.onRoomFull().subscribe(() => {
      console.log('Room is full');
      this.removeAllStreams();
      return;
    });

    this.socketService.onUserConnected().subscribe(async () => {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      this.socketService.sendOffer(
        this.roomId,
        this.peerConnection.localDescription as any,
        localStorage.getItem('username')!
      );
    });

    this.socketService.onUserDisconnected().subscribe(() => {
      this.remoteStream.getTracks().forEach((track) => track.stop());
      this.remoteVideo.nativeElement.srcObject = null;
    });

    this.socketService.onOfferReceived().subscribe(async (description) => {
      await this.peerConnection.setRemoteDescription(description);
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      this.socketService.sendAnswer(
        this.roomId,
        this.peerConnection.localDescription as any,
        localStorage.getItem('username')!
      );
    });

    this.socketService.onAnswerReceived().subscribe((description) => {
      this.peerConnection.setRemoteDescription(description);
    });
  }

  removeAllStreams() {
    this.localStream.getTracks().forEach((track) => track.stop());
    this.localVideo.nativeElement.srcObject = null;
    this.remoteStream.getTracks().forEach((track) => track.stop());
    this.remoteVideo.nativeElement.srcObject = null;
  }

  copyRoomId(): void {
    navigator.clipboard.writeText(this.roomId);
  }

  async startCall() {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    this.socketService.sendOffer(
      this.roomId,
      this.peerConnection.localDescription as any,
      localStorage.getItem('username')!
    );

    this.peerConnection.ontrack = (event) => {
      if (!this.remoteStream) {
        this.remoteStream = new MediaStream();
        this.remoteVideo.nativeElement.srcObject = this.remoteStream;
      }
      if (event.track.kind === 'video' || event.track.kind === 'audio') {
        this.remoteStream.addTrack(event.track);
      }
    };
  }

  async endCall() {
    this.socketService.endCall(
      this.roomId,
      localStorage.getItem('username')!
    );
    this.removeAllStreams();
    this.callStarted = false;
    this.videoCallWindowRef.nativeElement.classList.add('hidden');
  }
}
