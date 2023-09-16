export interface Message {
  userBy: {
    _id: string;
    username: string;
    avatar: string;
  };
  imagesSrc: string[];
  text: string | null;
  audioSrc: string | null;
  date: string;
}

export type Messages = Message[];
