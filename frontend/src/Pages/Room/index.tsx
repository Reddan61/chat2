import { FC } from "react";
import { Container, Box, makeStyles } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import ChatMessagesRoom from "../../Components/ChatWindow/ChatMessagesRoom";
import ChatBottom from "../../Components/ChatWindow/ChatBottom";
import { useRoom } from "../../hooks/useRoom";

export const Room: FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id: roomId } = useParams<{
    id: string;
  }>();
  const { isLoading, messages } = useRoom(roomId ?? "");

  const onBackHandler = () => {
    navigate("/rooms");
  };

  if (isLoading) return null;

  return (
    <Container className={classes.root}>
      <Box
        style={{
          width: "100%",
        }}
      >
        <ArrowBackIcon
          onClick={onBackHandler}
          style={{
            cursor: "pointer",
          }}
        />
      </Box>
      <ChatMessagesRoom messages={messages} />
      <ChatBottom roomId={roomId ?? ""} />
    </Container>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: "1 1 auto",
    maxWidth: "900px",
    overflow: "hidden",
  },
}));
