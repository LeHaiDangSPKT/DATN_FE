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
}
