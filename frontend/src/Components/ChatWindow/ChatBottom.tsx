import { ChangeEvent, FC, useState } from "react";
import {
  Box,
  IconButton,
  makeStyles,
  TextField,
  Theme,
} from "@material-ui/core";
import { PhotoCamera } from "@material-ui/icons";
import { InputImages } from "./ChoosedImages";
import socket from "../../Utils/socket";
import MicNoneIcon from "@material-ui/icons/MicNone";
import StopIcon from "@material-ui/icons/Stop";
import SendIcon from "@material-ui/icons/Send";
import Recording from "../Recording/Recording";
import { useAppSelector } from "../../Redux/store";
import { useMicrophoneRecord } from "../../hooks/useMicrophoneRecord";

interface Props {
  roomId: string;
}

const MAX_FILES_LENGTH = 5;
const fileExtensions = ["image/jpg", "image/jpeg", "image/png"];

const filterFilesByTypes = (fileList: FileList) => {
  return Array.from(fileList).filter((file) => {
    return fileExtensions.includes(file.type);
  });
};

const filteredFilesByLength = (files: File[]) => {
  return files.slice(0, MAX_FILES_LENGTH);
};

const validatedFiles = (fileList: FileList) => {
  return filteredFilesByLength(filterFilesByTypes(fileList));
};

const ChatBottom: FC<Props> = ({ roomId }) => {
  const { isRecording, startRecording, stopRecording } = useMicrophoneRecord();
  const classes = useStyles({
    isRecording,
  });

  const { id } = useAppSelector((state) => state.AuthPage);

  const [text, setText] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const isText = text.length > 0;
  const haveImages = images.length > 0;
  const showSendTextIcon = isText || haveImages;
  const showRecordIcon = !showSendTextIcon && !isRecording;
  const showStopRecordIcon = !showSendTextIcon && isRecording;

  const sendTextMessage = () => {
    const files = new FormData();

    images.forEach((file) => {
      files.append("file", file);
    });

    socket.emit("SEND:MESSAGE", {
      userId: id,
      text,
      roomId,
      files: files.getAll("file"),
    });

    setText("");
    setImages([]);
  };

  const sendAudio = (file: File) => {
    socket.emit("SEND:MESSAGE/AUDIO", {
      userId: id,
      text,
      roomId,
      file,
    });
  };

  const addImages = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const files = target.files;

    if (files) {
      const newImages = validatedFiles(files);

      setImages(newImages);
    }

    target.value = "";
  };

  const onDeleteImage = (image: File) => {
    setImages((state) => state.filter((el) => el !== image));
  };

  const onChangeTextHandler = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setText(e.target.value);
  };

  const sendMessageIconClick = () => {
    sendTextMessage();
  };

  const onMicrophoneIconClick = () => {
    startRecording({
      onStopRecord: sendAudio,
    });
  };

  const onStopRecordIconClick = () => {
    stopRecording();
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.top}>
        {isRecording && (
          <Box className={classes.recordIcon}>
            <Recording />
          </Box>
        )}
        {!isRecording && (
          <Box className={classes.inputRoot}>
            <TextField
              multiline
              rowsMax={10}
              className={classes.inputMessage}
              disabled={isRecording}
              value={text}
              onChange={onChangeTextHandler}
            />
          </Box>
        )}
        <Box>
          <input
            accept="image/*"
            multiple
            className={classes.inputPhoto}
            id="icon-button-file"
            type="file"
            onChange={addImages}
          />
          <label htmlFor="icon-button-file" className={classes.photoIcon}>
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
            >
              <PhotoCamera />
            </IconButton>
          </label>
        </Box>
        <Box>
          {showSendTextIcon && (
            <IconButton onClick={sendMessageIconClick}>
              <SendIcon color="primary" />
            </IconButton>
          )}
          {showRecordIcon && (
            <IconButton
              onClick={onMicrophoneIconClick}
              color="primary"
              aria-label="record voice"
              component="span"
            >
              <MicNoneIcon />
            </IconButton>
          )}
          {showStopRecordIcon && (
            <IconButton
              color="primary"
              aria-label="record voice"
              component="span"
              onClick={onStopRecordIconClick}
            >
              <StopIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      <InputImages onDelete={onDeleteImage} images={images} />
    </Box>
  );
};

const useStyles = makeStyles<
  Theme,
  {
    isRecording: boolean;
  }
>({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: "20px 15px 0",
  },
  top: {
    display: "flex",
    alignItems: ({ isRecording }) => {
      return isRecording ? "center" : "flex-end";
    },
    gap: "8px",
  },
  recordIcon: {
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  inputRoot: {
    width: "100%",
  },
  inputMessage: {
    width: "100%",
    minWidth: "300px",
  },
  messageRoot: {
    minWidth: "300px",
  },
  photoIcon: {
    margin: "5px",
  },
  inputPhoto: {
    display: "none",
  },
});

export default ChatBottom;
