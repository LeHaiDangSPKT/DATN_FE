export interface UserInterface {
  _id: string;
  avatar: string;
  fullName: string;
  photoURL?: string;
  email: string;
  address: string;
  phone: string;
  gender: string;
  birthday: Date;
  friends: String[];
  followStores: String[];
  warningCount: number;
  status: boolean;
}

export interface UserStorage {
  providerData: UserInterface[];
  stsTokenManager: {
    accessToken: string;
    refreshToken: string;
  };
}
