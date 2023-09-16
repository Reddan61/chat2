import { FC } from "react";
import { makeStyles } from "@material-ui/core";
import MessageCard from "./MessageCard";
import { Messages } from "../../types/Message";

interface Props {
  messages: Messages;
}

const ChatMessagesRoom: FC<Props> = ({ messages }) => {
  const classes = useStyles();

  return (
    <div className={classes.messages} id={"list"}>
      {messages.map((el, index) => {
        return <MessageCard key={index} message={el} />;
      })}
    </div>
  );
};

const useStyles = makeStyles(() => ({
  messages: {
    display: "flex",
    flexDirection: "column",
    flex: "1 1 auto",
    overflow: "auto",
    width: "100%",
    margin: "20px 0 0",
    gap: "16px",
  },
}));
export default ChatMessagesRoom;
