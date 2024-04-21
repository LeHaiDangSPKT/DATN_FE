export interface SubNoti {
  fullName: string;
  avatar: string;
  productId: string;
}
export interface NotificationInterface {
  _id: string;
  userIdFrom: string;
  userIdTo: string;
  content: string;
  type: string;
  status: boolean;
  updatedAt: Date;
  sub: SubNoti;
}

export interface NotiData {
  total: number;
  notifications: NotificationInterface[];
}
