// This file provides the real-time team chat page, connecting to Firebase Firestore for message sync, using signals.
import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ChatService } from '../../services/chat';
import { TeamService } from '../../services/team';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class ChatComponent implements OnInit, OnDestroy {
  private chatService = inject(ChatService);
  private teamService = inject(TeamService);
  private auth = inject(Auth);

  teams = this.teamService.teams;
  messages = this.chatService.messages;
  connected = this.chatService.connected;
  loading = this.chatService.loading;
  error = this.chatService.error;

  selectedTeamId = signal('');
  newMessage = signal('');

  async ngOnInit(): Promise<void> {
    this.teamService.loadAll();

    const fullName = this.getMyName();
    await this.chatService.connect(fullName);
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }

  selectTeam(teamId: string): void {
    this.selectedTeamId.set(teamId);
    this.chatService.listenToTeam(teamId);
  }

  async send(): Promise<void> {
    const teamId = this.selectedTeamId();
    const content = this.newMessage().trim();

    if (!teamId || !content) {
      return;
    }

    await this.chatService.sendMessage(teamId, content);
    this.newMessage.set('');
  }

  isMine(senderId: string): boolean {
    return this.chatService.isMine(senderId);
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
}