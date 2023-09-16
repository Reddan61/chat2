import { FC } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardHeader,
  Typography,
} from "@material-ui/core";
import { getUploadsSRC } from "../../Utils/getUploadsSRC";
import { useAppSelector } from "../../Redux/store";
import { useRooms } from "../../hooks/useRooms";
import { User } from "../../types/Users";

interface Props {
  user: User;
}

const CardUser: FC<Props> = ({ user }) => {
  const { id } = useAppSelector((state) => state.AuthPage);
  const { createRoom } = useRooms();
  const navigate = useNavigate();

  const createRoomHandle = async () => {
    if (!id) return null;

    const room = await createRoom(id, user._id);

    if (room) {
      return navigate(`/rooms/${room._id}`);
    }
  };

  return (
    <Card variant={"elevation"}>
      <CardHeader
        avatar={<Avatar src={getUploadsSRC(user.avatar) ?? undefined} />}
        title={<Typography>{user.username}</Typography>}
      />
      <CardActions>
        <Button size="small" color="primary" onClick={createRoomHandle}>
          Отправить сообщение
        </Button>
      </CardActions>
    </Card>
  );
};

export default CardUser;
