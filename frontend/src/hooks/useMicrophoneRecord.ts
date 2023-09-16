import { useState } from "react";
import { MediaRecorderCustom } from "../Utils/mediaRecorder";
import { useSnackbar } from "notistack";

type StartRecordingProps = MediaRecorderCustom["handlers"];

export const useMicrophoneRecord = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [isRecording, setRecording] = useState(false);
  const [MediaRecorder, setMediaRecorder] =
    useState<MediaRecorderCustom | null>(null);

  const startRecording = async ({ onStopRecord }: StartRecordingProps) => {
    new MediaRecorderCustom({
      onAvailableUse: (Recorder) => {
        setMediaRecorder(Recorder);

        const isStarting = Recorder.startRecord();

        setRecording(isStarting);
      },
      onBlockUse: () => {
        enqueueSnackbar("Ошибка записи", {
          variant: "error",
        });
      },
      onStopRecord: (file) => {
        setMediaRecorder(null);
        setRecording(false);

        onStopRecord(file);
      },
    });
  };

  const stopRecording = () => {
    MediaRecorder?.stopRecord();
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
  };
};
