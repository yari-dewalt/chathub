export interface Message {
  _id: string;
  user: UserType;
  conversationId: string;
  text: string;
  timestamp: string;
}

export interface Conversation {
  _id: string;
  user1: UserType;
  user2: UserType;
  messages: Message[];
  timestamp: string;
}

export interface Notification {
  _id: string;
  type: string;
  user: UserType;
  conversationId: string;
  text: string;
  timestamp: string;
}

export interface UserType {
  _id: string;
  name: string;
  username: string;
  password: string;
  friends: UserType[];
  conversations: Conversation[];
  notifications: Notification[];
}
