// This file implements the live meeting room: camera/mic capture, WebRTC peer connections, and Socket.IO signaling.
import { Component, OnInit, OnDestroy, inject, signal, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { io, Socket } from 'socket.io-client';

import { environment } from '../../../environments/environment';
import { Auth } from '../../services/auth';
import { MeetingService } from '../../services/meeting';
import { Meeting } from '../../models/meeting.model';

interface RemotePeer {
  socketId: string;
  fullName: string;
  stream?: MediaStream;
  connection: RTCPeerConnection;
}

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

@Component({
  selector: 'app-meeting-room',
  standalone: true,
  imports: [],
  templateUrl: './meeting-room.html',
  styleUrl: './meeting-room.scss',
})
export class MeetingRoomComponent implements OnInit, OnDestroy {
  @ViewChild('localVideo') localVideoRef!: ElementRef<HTMLVideoElement>;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(Auth);
  private meetingService = inject(MeetingService);

  private socket: Socket | null = null;
  private localStream: MediaStream | null = null;
  private peers = new Map<string, RemotePeer>();
  private roomId = '';

  meeting = signal<Meeting | null>(null);
  remotePeers = signal<RemotePeer[]>([]);
  micOn = signal(true);
  cameraOn = signal(true);
  error = signal('');
  loading = signal(true);

  async ngOnInit(): Promise<void> {
    this.roomId = this.route.snapshot.paramMap.get('roomId') ?? '';

    if (!this.roomId) {
      this.error.set('Invalid meeting room');
      this.loading.set(false);
      return;
    }

    this.meetingService.findByRoomId(this.roomId).subscribe({
      next: (meeting) => this.meeting.set(meeting),
      error: () => this.error.set('Meeting not found'),
    });

    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (this.localVideoRef?.nativeElement) {
        this.localVideoRef.nativeElement.srcObject = this.localStream;
      }
    } catch {
      this.error.set('Could not access camera/microphone. Please allow permissions.');
      this.loading.set(false);
      return;
    }

    this.connectSignaling();
    this.loading.set(false);
  }

  private connectSignaling(): void {
    const token = this.auth.getToken();

    this.socket = io(`${environment.apiUrl}/meetings`, {
      auth: { token },
    });

    this.socket.on('connect', () => {
      this.socket?.emit('join-room', {
        roomId: this.roomId,
        fullName: this.getMyName(),
      });
    });

    this.socket.on('peer-joined', (data: { socketId: string; fullName: string }) => {
      this.createPeerConnection(data.socketId, data.fullName, true);
    });

    this.socket.on('peer-left', (data: { socketId: string }) => {
      const peer = this.peers.get(data.socketId);
      peer?.connection.close();
      this.peers.delete(data.socketId);
      this.syncPeersSignal();
    });

    this.socket.on('signal-offer', async (data: { from: string; offer: RTCSessionDescriptionInit }) => {
      const peer = this.createPeerConnection(data.from, 'Participant', false);
      await peer.connection.setRemoteDescription(new RTCSessionDescription(data.offer));

      const answer = await peer.connection.createAnswer();
      await peer.connection.setLocalDescription(answer);

      this.socket?.emit('signal-answer', { to: data.from, answer });
    });

    this.socket.on('signal-answer', async (data: { from: string; answer: RTCSessionDescriptionInit }) => {
      const peer = this.peers.get(data.from);

      if (peer) {
        await peer.connection.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    });

    this.socket.on('signal-ice-candidate', async (data: { from: string; candidate: RTCIceCandidateInit }) => {
      const peer = this.peers.get(data.from);

      if (peer && data.candidate) {
        await peer.connection.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });
  }

  private createPeerConnection(socketId: string, fullName: string, isInitiator: boolean): RemotePeer {
    const existing = this.peers.get(socketId);

    if (existing) {
      return existing;
    }

    const connection = new RTCPeerConnection(ICE_SERVERS);

    this.localStream?.getTracks().forEach((track) => {
      connection.addTrack(track, this.localStream!);
    });

    const peer: RemotePeer = { socketId, fullName, connection };
    this.peers.set(socketId, peer);

    connection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket?.emit('signal-ice-candidate', {
          to: socketId,
          candidate: event.candidate,
        });
      }
    };

    connection.ontrack = (event) => {
      peer.stream = event.streams[0];
      this.syncPeersSignal();
    };

    if (isInitiator) {
      connection
        .createOffer()
        .then((offer) => connection.setLocalDescription(offer).then(() => offer))
        .then((offer) => {
          this.socket?.emit('signal-offer', { to: socketId, offer });
        });
    }

    this.syncPeersSignal();

    return peer;
  }

  private syncPeersSignal(): void {
    this.remotePeers.set(Array.from(this.peers.values()));
  }

  private getMyName(): string {
    const token = this.auth.getToken();

    if (!token) {
      return 'Guest';
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.email ?? 'Guest';
    } catch {
      return 'Guest';
    }
  }

  toggleMic(): void {
    if (!this.localStream) {
      return;
    }

    const enabled = !this.micOn();
    this.localStream.getAudioTracks().forEach((track) => (track.enabled = enabled));
    this.micOn.set(enabled);
  }

  toggleCamera(): void {
    if (!this.localStream) {
      return;
    }

    const enabled = !this.cameraOn();
    this.localStream.getVideoTracks().forEach((track) => (track.enabled = enabled));
    this.cameraOn.set(enabled);
  }

  leaveMeeting(): void {
    this.cleanup();
    this.router.navigate(['/meetings']);
  }

  private cleanup(): void {
    this.socket?.emit('leave-room', { roomId: this.roomId });
    this.socket?.disconnect();

    this.peers.forEach((peer) => peer.connection.close());
    this.peers.clear();

    this.localStream?.getTracks().forEach((track) => track.stop());
  }

  ngOnDestroy(): void {
    this.cleanup();
  }
}