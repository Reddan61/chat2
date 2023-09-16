import { Messages } from "./Message";
import { Users } from "./Users";

export interface Room {
  _id: string;
  users: Users;
  messages: Messages;
}

export type Rooms = Room[];
