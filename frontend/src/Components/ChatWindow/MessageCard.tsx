import { FC } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Theme,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { getUploadsSRC } from "../../Utils/getUploadsSRC";
import AudioComponent from "./AudioComponent";
import { useAppSelector } from "../../Redux/store";
import { Message } from "../../types/Message";

interface Props {
  message: Message;
}

const isToday = (date: Date) => {
  const prevYear = date.getFullYear();
  const prevMonth = date.getMonth();
  const prevDay = date.getDate();

  const now = new Date();
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth();
  const nowDay = now.getDate();

  return nowYear === prevYear && nowMonth === prevMonth && nowDay === prevDay;
};

const getDate = (dateStr: string) => {
  const date = new Date(dateStr);

  const minutes = String(date.getMinutes()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  if (isToday(date)) return `${hours}:${minutes}`;

  return `${year}:${month}:${day}`;
};

const MessageCard: FC<Props> = ({ message }) => {
  const { id } = useAppSelector((state) => state.AuthPage);
  const classes = useStyles({
    ownerId: message.userBy._id,
    userId: id ?? "",
  });

  const images = message.imagesSrc;
  const date = getDate(message.date);

  return (
    <Card variant="outlined" className={classes.card}>
      <CardContent className={classes.container}>
        <Box className={classes.top}>
          <Avatar src={message.userBy.avatar} />
          <Box className={classes.content}>
            <Typography>
              {message.userBy.username} {date}
            </Typography>
            {!message.audioSrc ? (
              <Typography className={classes.text}>{message.text}</Typography>
            ) : (
              <AudioComponent audio={message.audioSrc} />
            )}
          </Box>
        </Box>
        <Box className={classes.images}>
          {images.map((el, index) => (
            <img
              className={classes.image}
              key={String(el + index)}
              src={getUploadsSRC(el) ?? ""}
              alt={"img"}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

const useStyles = makeStyles<
  Theme,
  {
    ownerId: string;
    userId: string;
  }
>({
  card: {
    maxWidth: "350px",
    minWidth: "350px",
    overflow: "unset",
    alignSelf: ({ ownerId, userId }) =>
      ownerId === userId ? "flex-end" : "flex-start",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  top: {
    display: "flex",
    gap: "8px",
  },
  content: {
    display: "flex",
    flexDirection: "column",
  },
  images: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  image: {
    maxWidth: "100%",
    objectFit: "contain",
  },
  text: {
    wordBreak: "break-all",
  },
});

export default MessageCard;
