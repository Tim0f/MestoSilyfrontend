export interface ChatUser {
  id: string;
  firstName: string;
  lastName: string;
}

export interface ChatParticipant {
  user: ChatUser;
}

export type ChatType = "SUPPORT" | "SECTION" | "EVENT";

export interface ChatItem {
  id: string;
  type: ChatType;
  section?: {
    id: string;
    name: string;
  } | null;
  event?: {
    id: string;
    name: string;
  } | null;

  participants: ChatParticipant[];
  _count: {
    messages: number;
  };
}
