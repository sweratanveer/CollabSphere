// This file connects to Firebase (Auth via custom token + Firestore) and provides signal-based real-time chat state.
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithCustomToken,
  Auth,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Firestore,
  Unsubscribe,
} from 'firebase/firestore';

import { environment } from '../../environments/environment';
import { ChatMessage } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private http = inject(HttpClient);

  private firebaseApp: FirebaseApp | null = null;
  private auth: Auth | null = null;
  private firestore: Firestore | null = null;
  private unsubscribeMessages: Unsubscribe | null = null;

  messages = signal<ChatMessage[]>([]);
  connected = signal(false);
  loading = signal(false);
  error = signal('');

  private currentUserId = '';
  private currentUserName = '';

  async connect(fullName: string): Promise<void> {
    if (this.firebaseApp) {
      return;
    }

    this.currentUserName = fullName;
    this.loading.set(true);

    try {
      const tokenResponse = await this.http
        .get<{ token: string }>(`${environment.apiUrl}/chat/firebase-token`)
        .toPromise();

      if (!tokenResponse?.token) {
        throw new Error('No Firebase token received');
      }

      this.firebaseApp = initializeApp(environment.firebaseConfig);
      this.auth = getAuth(this.firebaseApp);
      this.firestore = getFirestore(this.firebaseApp);

      const credential = await signInWithCustomToken(this.auth, tokenResponse.token);
      this.currentUserId = credential.user.uid;

      this.connected.set(true);
      this.loading.set(false);
    } catch (err) {
      this.error.set('Failed to connect to chat');
      this.loading.set(false);
      this.connected.set(false);
    }
  }

  listenToTeam(teamId: string): void {
    if (!this.firestore) {
      return;
    }

    this.unsubscribeMessages?.();

    const messagesRef = collection(this.firestore, 'messages');
    const q = query(
      messagesRef,
      where('teamId', '==', teamId),
      orderBy('createdAt', 'asc'),
    );

    this.messages.set([]);

    this.unsubscribeMessages = onSnapshot(
      q,
      (snapshot) => {
        const list: ChatMessage[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();

          list.push({
            id: doc.id,
            content: data['content'],
            senderId: data['senderId'],
            senderName: data['senderName'],
            teamId: data['teamId'],
            createdAt: data['createdAt']?.toMillis?.() ?? Date.now(),
          });
        });

        this.messages.set(list);
      },
      () => {
        this.error.set('Failed to load messages');
      },
    );
  }

  async sendMessage(teamId: string, content: string): Promise<void> {
    if (!this.firestore || !content.trim()) {
      return;
    }

    const messagesRef = collection(this.firestore, 'messages');

    await addDoc(messagesRef, {
      content: content.trim(),
      senderId: this.currentUserId,
      senderName: this.currentUserName,
      teamId,
      createdAt: serverTimestamp(),
    });
  }

  isMine(senderId: string): boolean {
    return senderId === this.currentUserId;
  }

  stopListening(): void {
    this.unsubscribeMessages?.();
    this.unsubscribeMessages = null;
  }

  disconnect(): void {
    this.stopListening();
    this.connected.set(false);
  }
}