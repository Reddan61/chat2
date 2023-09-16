import { Messages } from "../types/Message";
import { Users } from "../types/Users";
import { Response, instance } from "./API";

export const MessagesAPI = {
  getRooms: (userId: string) => {
    return instance.get(`/rooms?id=${userId}`).then((response) => {
      return response.data;
    });
  },
  createRoom: (meId: string, userId: string) => {
    return instance
      .post<Response<CreateRoomResponse>>(`/rooms`, {
        user1Id: meId,
        user2Id: userId,
      })
      .then((response) => response.data);
  },
  getRoomById: (roomId: string) => {
    return instance
      .post<Response<RoomResponse>>(`/rooms/roomId`, { roomId })
      .then((response) => response.data);
  },
};

interface RoomResponse {
  messages: Messages;
  users: Users;
  _id: string;
}

interface CreateRoomResponse {
  messages: Messages;
  users: Users;
  _id: string;
}
