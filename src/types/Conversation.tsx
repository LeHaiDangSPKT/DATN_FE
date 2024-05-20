export interface ConservationInterface {
  conversationId: string;
  isMine: boolean;
  isReadLastMessage: boolean;
  lastMessageId: string;
  lastMessageText: string;
  lastTime: string;
  receiverAvatar: string;
  receiverId: string;
  receiverName: string;
  receiverRole: string;
  senderRole: string;
}

export interface ConversationDetailInterface {
  conversationId: string;
  data: {
    id: string;
    text: string;
    isRead: boolean;
    isMine: boolean;
    createdAt: string;
  }[];
  receiverAvatar: string;
  receiverId: string;
  receiverName: string;
}
