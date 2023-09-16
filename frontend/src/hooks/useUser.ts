import { useDispatch } from "react-redux";
import { AuthApi } from "../API/Auth";
import { isSuccess } from "../Utils/api";
import {
  AUTH_REDUCERS_TYPES,
  AuthReducerActions,
} from "../Redux/Reducers/authReducer";
import { useSnackbar } from "notistack";

export const useUser = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const updateAvatar = async (file: File) => {
    try {
      const data = new FormData();

      data.append("file", file);

      const response = await AuthApi.updateAvatar(data);

      if (isSuccess(response.status)) {
        dispatch(
          AuthReducerActions[AUTH_REDUCERS_TYPES.UPDATEAVATAR](response.data)
        );
      }
    } catch {
      enqueueSnackbar("Ошибка замены аватара", {
        variant: "error",
      });
    }
  };

  return {
    updateAvatar,
  };
};
