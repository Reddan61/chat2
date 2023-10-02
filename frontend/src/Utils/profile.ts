const acceptedAvatarMimeTypes = ["image/jpg", "image/png", "image/jpeg"];

export const validateFile = (file: File) => {
  return acceptedAvatarMimeTypes.includes(file.type);
};
