interface MediaRecordConstructor {
  onAvailableUse: (MediaRecorder: MediaRecorderCustom) => unknown;
  onBlockUse: () => unknown;
  onStopRecord: (file: File) => unknown;
}

interface Handlers {
  onStopRecord: MediaRecordConstructor["onStopRecord"];
}

export class MediaRecorderCustom {
  private chunks: BlobPart[] = [];
  private MediaRecorder: MediaRecorder | null = null;
  private handlers: Handlers = {
    onStopRecord: () => {},
  };

  private canRecord() {
    return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
  }

  constructor({
    onAvailableUse,
    onBlockUse,
    onStopRecord,
  }: MediaRecordConstructor) {
    if (!this.canRecord()) {
      onBlockUse();
      return this;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);

        this.MediaRecorder = mediaRecorder;
        this.handlers = {
          onStopRecord,
        };

        onAvailableUse(this);
      })
      .catch(() => {
        onBlockUse();
      });

    return this;
  }

  private onDataAvailableHandler(e: BlobEvent) {
    this.chunks.push(e.data);
  }

  private onStop() {
    const file = new File(this.chunks, "audio.ogg", { type: "audio/ogg" });

    this.handlers.onStopRecord(file);
  }

  public startRecord() {
    if (!this.MediaRecorder) return false;

    this.MediaRecorder.start();

    this.MediaRecorder.ondataavailable = this.onDataAvailableHandler.bind(this);
    this.MediaRecorder.onstop = this.onStop.bind(this);

    return true;
  }

  public stopRecord() {
    if (!this.MediaRecorder) return false;

    this.MediaRecorder.stop();

    return true;
  }
}
