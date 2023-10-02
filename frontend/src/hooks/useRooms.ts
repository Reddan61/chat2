import { useState } from "react";
import { MessagesAPI } from "../API/Messages";
import { useAppSelector } from "../Redux/store";
import { Rooms } from "../types/Room";
import { isSuccess } from "../Utils/api";
import { useSnackbar } from "notistack";

export const useRooms = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useAppSelector((state) => state.AuthPage);

  const [rooms, setRooms] = useState<Rooms>([]);

  const [isLoading, setLoading] = useState(false);

  const getRooms = async () => {
    if (!id) return false;

    try {
      const response = await MessagesAPI.getRooms(id);

      if (isSuccess(response.status)) {
        setRooms(response.data);

        return true;
      }

      return false;
    } catch {
      enqueueSnackbar("Ошибка получения комнат", {
        variant: "error",
      });

      return false;
    }
  };

  const getRoomsWithLoading = async () => {
    setLoading(true);

    const result = await getRooms();

    setLoading(false);

    return result;
  };

  const createRoom = async (meId: string, userId: string) => {
    try {
      const response = await MessagesAPI.createRoom(meId, userId);

      if (isSuccess(response.status)) {
        return response.data;
      }

      return null;
    } catch {
      enqueueSnackbar("Ошибка создания комнаты", {
        variant: "error",
      });

      return null;
    }
  };

  return {
    rooms,
    isLoading,
    getRooms: getRoomsWithLoading,
    createRoom,
  };
};
