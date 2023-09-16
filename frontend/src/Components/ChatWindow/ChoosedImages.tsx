import { Box } from "@material-ui/core";
import { FC, useMemo } from "react";
import CloseIcon from "@material-ui/icons/Close";

interface Props {
  images: File[];
  onDelete: (file: File) => unknown;
}

export const InputImages: FC<Props> = ({ images, onDelete }) => {
  const haveImages = images.length > 0;

  return (
    <Box
      style={{
        display: "flex",
        marginTop: haveImages ? "8px" : 0,
        gap: "8px",
      }}
    >
      {images.map((image, index) => (
        <Image key={index} image={image} onDelete={onDelete} />
      ))}
    </Box>
  );
};

interface ImageProps {
  image: File;
  onDelete: Props["onDelete"];
}

const Image: FC<ImageProps> = ({ image, onDelete }) => {
  const url = useMemo(() => {
    return URL.createObjectURL(image);
  }, [image]);

  const closeHandler = () => {
    onDelete(image);
  };

  return (
    <Box
      style={{
        position: "relative",
        minWidth: "50px",
        maxWidth: "50px",
        minHeight: "50px",
        maxHeight: "50px",
      }}
    >
      <CloseIcon
        fontSize={"small"}
        onClick={closeHandler}
        style={{
          position: "absolute",
          right: "0",
          background: "black",
          color: "white",
          cursor: "pointer",
        }}
      />
      <img src={url} width={"100%"} height={"100%"} alt={"uploaded"} />
    </Box>
  );
};
