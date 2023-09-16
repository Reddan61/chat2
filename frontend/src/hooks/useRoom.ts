import { useEffect, useState } from "react";
import { MessagesAPI } from "../API/Messages";
import { isSuccess } from "../Utils/api";
import socket from "../Utils/socket";
import { Message, Messages } from "../types/Message";
import { Users } from "../types/Users";
import { useSnackbar } from "notistack";

interface onNewMessageProps {
  roomId: string;
  message: Message;
}

export const useRoom = (id: string) => {
  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setLoading] = useState(true);
  const [{ messages, users }, setRoom] = useState({
    messages: [] as Messages,
    users: [] as Users,
  });

  const getRoom = async () => {
    try {
      const response = await MessagesAPI.getRoomById(id);

      if (isSuccess(response.status)) {
        const { messages, users } = response.data;

        setRoom({
          messages,
          users,
        });

        return true;
      }

      return false;
    } catch {
      enqueueSnackbar("Ошибка получения сообщений", {
        variant: "error",
      });

      return false;
    }
  };

  const getRoomWithLoading = async () => {
    const getted = await getRoom();

    if (getted) {
      socket.on("NEW:MESSAGE", onNewMessage);
    }

    setLoading(false);
  };

  const onNewMessage = ({ message, roomId }: onNewMessageProps) => {
    if (id !== roomId) return null;

    setRoom((state) => ({ ...state, messages: [...state.messages, message] }));
  };

  useEffect(() => {
    getRoomWithLoading();

    return () => {
      socket.off("NEW:MESSAGE");
    };
  }, []);

  return {
    isLoading,
    messages,
    users,
  };
};
