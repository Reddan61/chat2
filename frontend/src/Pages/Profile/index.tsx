import { ChangeEvent } from "react";
import { Avatar, Box, Button } from "@material-ui/core";
import { getUploadsSRC } from "../../Utils/getUploadsSRC";
import { validateFile } from "../../Utils/profile";
import { useAppSelector } from "../../Redux/store";
import { useUser } from "../../hooks/useUser";

const Profile = () => {
  const { avatarURL } = useAppSelector((state) => state.AuthPage);
  const { updateAvatar } = useUser();

  const avatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return null;

    if (validateFile(file)) {
      updateAvatar(file);
    }
  };

  return (
    <Box>
      <Box
        style={{
          display: "inline-block",
          verticalAlign: "top",
        }}
      >
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar
            alt="Avatar"
            src={getUploadsSRC(avatarURL) ?? undefined}
            variant="rounded"
            style={{ width: "300px", height: "300px" }}
          />
          <input
            accept="image/jpeg,image/png,image/jpg"
            id="contained-button-file"
            multiple
            type="file"
            style={{ display: "none" }}
            onChange={avatarChange}
          />
          <label
            htmlFor="contained-button-file"
            style={{
              marginTop: "10px",
            }}
          >
            <Button variant="contained" color="primary" component="span">
              Изменить изображение
            </Button>
          </label>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
