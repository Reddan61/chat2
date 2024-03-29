export const getUploadsSRC = (url: string | null) => {
  if (url && url.length !== 0) {
    return `http://localhost:8888/${url}`;
  } else {
    return null;
  }
};
