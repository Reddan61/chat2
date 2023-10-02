import React, { useMemo } from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { Room } from "../../types/Room";

export const RoomCard: React.FC<{ room: Room }> = ({ room }) => {
  const navigate = useNavigate();

  const roomName = useMemo(() => {
    return room.users
      .map((user) => user.username)
      .join(`/`)
      .slice(0, 20);
  }, [room.users]);

  const onRoomClick = () => {
    navigate(`/rooms/${room._id}`);
  };

  return (
    <Card
      variant={"elevation"}
      onClick={onRoomClick}
      style={{
        cursor: "pointer",
      }}
    >
      <CardContent>
        <Typography>{roomName} ...</Typography>
      </CardContent>
    </Card>
  );
};
