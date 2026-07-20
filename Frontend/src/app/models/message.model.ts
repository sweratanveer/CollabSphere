// This file defines the TypeScript interface for a chat message stored in Firestore.
export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  teamId: string;
  createdAt: number;
}