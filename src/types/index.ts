// Icon types
export type IconName =
  | 'message'
  | 'users'
  | 'phone'
  | 'settings'
  | 'search'
  | 'video'
  | 'info'
  | 'arrow-left'
  | 'sun'
  | 'moon'
  | 'plus'
  | 'smile'
  | 'send'
  | 'paperclip'
  | 'eye'
  | 'eye-off'
  | 'chevron'
  | 'file'
  | 'check'
  | 'clock'
  | 'wifi-off'
  | 'panel'
  | 'x'
  | 'user-plus'
  | 'user-check'
  | 'user-x'
  | 'user-minus'
  | 'shield-off'
  | 'log-out'
  | 'bell'
  | 'image'
  | 'trash'
  | 'crown'
  | 'more-vertical'
  | 'edit'
  | 'camera';

// User & Friend types
export type FriendStatus = 'friend' | 'pending-sent' | 'pending-received' | 'blocked' | 'none';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  online?: boolean;
  status?: FriendStatus;
}

export interface Friend extends User {
  status: 'friend';
}

export interface FriendRequest {
  id: number;
  user: User;
  createdAt: string;
}

export interface BlockedUser extends User {
  blockedAt: string;
}

// Message types
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'seen';

export interface MessageReply {
  id: number;
  text: string;
  author: string;
}

export interface MessageFile {
  name: string;
  size: string;
}

export interface Message {
  id: number;
  from: 'me' | 'other';
  text?: string;
  time: string;
  status?: MessageStatus;
  image?: string;
  file?: MessageFile;
  date?: string;
  replyTo?: MessageReply;
  edited?: boolean;
  recalled?: boolean;
  uploadProgress?: number;
}

// Conversation types
export interface Conversation {
  id: number;
  name: string;
  preview: string;
  time: string;
  unread: number;
  typing?: boolean;
  online?: boolean;
  group?: boolean;
  members?: User[];
  ownerId?: number;
}

export interface GroupMember extends User {
  role: 'owner' | 'member';
}

// App state types
export type AppView = 'messages' | 'contacts' | 'calls' | 'profile';
export type ContactsTab = 'friends' | 'received' | 'sent' | 'blocked';
